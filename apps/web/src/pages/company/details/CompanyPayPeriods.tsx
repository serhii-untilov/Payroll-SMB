import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { IPayPeriod } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isEqual } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { calculatePayroll } from '../../../services/company.service';
import {
    closePayPeriod,
    getCurrentPayPeriod,
    getPayPeriodList,
    getPayPeriodName,
    openPayPeriod,
} from '../../../services/payPeriod.service';
import { sumFormatter } from '../../../services/utils';

type Props = {
    companyId: number | undefined;
};

export function CompanyPayPeriods(params: Props) {
    const { companyId } = params;
    const { t } = useTranslation();
    const { locale } = useLocale();
    const { company, payPeriod, setPayPeriod } = useAppContext();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const gridRef = useGridApiRef();

    const columns: GridColDef[] = [
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
                    isEqual(params.row.dateFrom, company?.payPeriod),
                    locale.dateLocale,
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

    const { data, isError, isLoading, error } = useQuery<IPayPeriod[], Error>({
        queryKey: ['payPeriod', 'list', { companyId, relations: true, fullFieldList: true }],
        queryFn: async () => {
            const payPeriodList = await getPayPeriodList(companyId, true, true);
            return payPeriodList
                .filter((o) => o.dateFrom.getTime() <= (payPeriod || new Date()).getTime())
                .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime());
        },
        enabled: !!companyId,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onEdit = (_id: number) => {
        console.log('onEdit');
        navigate('/payroll?tab=payroll&return=true');
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const invalidateQueries = async () => {
        const resourceList = ['position', 'company', 'payPeriod', 'task'];
        for (const key of resourceList) {
            await queryClient.invalidateQueries({ queryKey: [key], refetchType: 'all' });
        }
    };

    const onCalculate = async () => {
        if (companyId) {
            await calculatePayroll(companyId);
            await invalidateQueries();
        }
    };

    const onClose = async () => {
        if (companyId) {
            const current = await getCurrentPayPeriod(companyId, false, true);
            if (current.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const next = await closePayPeriod(current);
            setPayPeriod(next.dateFrom);
            await invalidateQueries();
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
