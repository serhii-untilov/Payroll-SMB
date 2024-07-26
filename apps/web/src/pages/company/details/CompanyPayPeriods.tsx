import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import { useAppContext } from '@/hooks/useAppContext';
import { useCurrentPayPeriod } from '@/hooks/useCurrentPayPeriod';
import { useLocale } from '@/hooks/useLocale';
import { usePayPeriodList } from '@/hooks/usePayPeriodList';
import { companiesSalaryCalculate } from '@/services/company.service';
import { payPeriodsClose, payPeriodsOpen } from '@/services/payPeriod.service';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import * as utils from '@/utils/invalidateQueries';
import { sumFormatter } from '@/utils/sumFormatter';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { dateUTC, monthBegin, toDate } from '@repo/shared';
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
    const {
        data: currentPayPeriod,
        isLoading,
        isError,
        error,
    } = useCurrentPayPeriod({
        companyId,
        relations: false,
        fullFieldList: true,
    });
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
            .filter((o) => o.dateFrom.getTime() <= (payPeriod || new Date()).getTime())
            .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    }, [rawData, payPeriod]);

    const onEdit = (_id: number) => {
        navigate('/payroll?tab=payroll&return=true');
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const invalidateQueries = async () => {
        await utils.invalidateQueries(queryClient, [
            ResourceType.Position,
            ResourceType.Company,
            ResourceType.PayPeriod,
            ResourceType.Task,
        ]);
    };

    const onCalculate = async () => {
        if (companyId) {
            await companiesSalaryCalculate(companyId);
            await invalidateQueries();
        }
    };

    const onClose = async () => {
        if (companyId && currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const next = await payPeriodsClose(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(next.dateFrom);
            await invalidateQueries();
        }
    };

    const onOpen = async () => {
        if (companyId && currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const prior = await payPeriodsOpen(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(prior.dateFrom);
            await invalidateQueries();
        }
    };

    if (isLoading) return <Loading />;

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
                        toDate(params.row.dateFrom),
                        toDate(params.row.dateTo),
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
