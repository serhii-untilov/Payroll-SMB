import { api } from '@/api';
import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { calculatePayroll } from '@/services/company.service';
import { invalidateQueries, sumFormatter } from '@/utils';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { dateUTC, monthBegin, ResourceType, toDate } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    companyId: number | undefined;
};

export function CompanyPayPeriods(params: Props) {
    const { companyId } = params;
    const { locale } = useLocale();
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const gridRef = useGridApiRef();
    const columns = useColumns(
        locale.dateLocale,
        company?.payPeriod ? dateUTC(new Date(company.payPeriod)) : monthBegin(new Date()),
    );
    const { data: rawData, isLoading } = usePayPeriodList({
        companyId,
        relations: true,
        fullFieldList: true,
    });
    const data = useMemo(() => {
        return rawData
            .filter((o) => toDate(o.dateFrom).getTime() <= (payPeriod || new Date()).getTime())
            .sort((a, b) => toDate(b.dateFrom).getTime() - toDate(a.dateFrom).getTime());
    }, [rawData, payPeriod]);

    if (isLoading) {
        return <Loading />;
    }

    const onEdit = (_id: number) => {
        navigate('/payroll?tab=payroll&return=true');
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const invalidate = async () => {
        await invalidateQueries(queryClient, [
            ResourceType.POSITION,
            ResourceType.COMPANY,
            ResourceType.PAY_PERIOD,
            ResourceType.TASK,
        ]);
    };

    const onCalculate = async () => {
        if (companyId) {
            await calculatePayroll(companyId);
            await invalidate();
        }
    };

    const onClose = async () => {
        if (companyId) {
            const current = (
                await api.payPeriodsFindCurrent({
                    companyId,
                    relations: false,
                    fullFieldList: true,
                })
            ).data;
            if (toDate(current.dateFrom).getTime() !== payPeriod?.getTime()) {
                await invalidate();
                return;
            }
            const next = (await api.payPeriodsClose(current.id)).data;
            setPayPeriod(toDate(next.dateFrom));
            await invalidate();
        }
    };

    const onOpen = async () => {
        if (companyId) {
            const current = await getCurrentPayPeriod(companyId, false, true);
            if (current.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const prior = await openPayPeriod(current);
            setPayPeriod(prior.dateFrom);
            await invalidateQueries();
        }
    };

    return (
        <>
            <Toolbar
                onCalculate={onCalculate}
                onClose={onClose}
                onOpen={onOpen}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={data || []}
                columns={columns}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    taxes: false,
                }}
                checkboxSelection={false}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEdit(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEdit(params.row.id)}
            />
        </>
    );
}

function useColumns(dateLocale: string, payPeriod: Date) {
    const { t } = useTranslation();
    const columns = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: t('Pay Period'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (params) => {
                    return getPayPeriodName(
                        params.row.dateFrom,
                        params.row.dateTo,
                        isEqual(params.row.dateFrom, payPeriod),
                        dateLocale,
                    );
                },
            },
            {
                field: 'inBalance',
                headerName: t('In Balance'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return Number(params.value) === 0 ? '' : params.value;
                },
            },
            {
                field: 'accruals',
                headerName: t('Accruals'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'deductions',
                headerName: t('Deductions'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'taxes',
                headerName: t('Taxes'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'netPay',
                headerName: t('Net Pay'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    const netPay =
                        Number(params.row.inBalance) +
                        Number(params.row.accruals) -
                        (Number(params.row.deductions) - Number(params.row.payments));
                    return sumFormatter(netPay);
                },
            },
            {
                field: 'payments',
                headerName: t('Payments Sum'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'outBalance',
                headerName: t('Out Balance'),
                type: 'number',
                width: 190,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
        ];
    }, [t, dateLocale, payPeriod]);
    return columns;
}
