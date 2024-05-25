import {
    GridCallbackDetails,
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
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { getPayPeriodList, getPayPeriodName } from '../../../services/payPeriod.service';
import { calculatePayroll } from '../../../services/company.service';
import { numericFormatter } from 'react-number-format';
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
            width: 180,
            sortable: true,
            valueGetter: (params) => {
                return Number(params.value) === 0 ? '' : params.value;
            },
        },
        {
            field: 'accruals',
            headerName: t('Accruals'),
            type: 'number',
            width: 170,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'deductions',
            headerName: t('Deductions'),
            type: 'number',
            width: 170,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'taxes',
            headerName: t('Taxes'),
            type: 'number',
            width: 170,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'netPay',
            headerName: t('Net Pay'),
            type: 'number',
            width: 170,
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
            width: 170,
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

    const onEdit = (id: number) => {
        console.log('onEdit');
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onCalculate = async () => {
        console.log('onCalculate');
        if (companyId) {
            await calculatePayroll(companyId);
            queryClient.invalidateQueries({ queryKey: ['payPeriod'], refetchType: 'all' });
            queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
        }
    };

    const onClose = () => {
        console.log('onClose');
    };

    const onOpen = () => {
        console.log('onOpen');
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
                    details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onEdit(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEdit(params.row.id)}
            />
        </>
    );
}
