import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { IFindPayment, IPayment, maxDate } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import useLocale from '../../../hooks/useLocale';
import { getPayments } from '../../../services/payment.service';
import { deletePosition } from '../../../services/position.service';

export function PaymentList(props: IFindPayment) {
    const { companyId, payPeriod } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const columns: GridColDef[] = [
        {
            field: 'docNumber',
            headerName: t('Number'),
            type: 'string',
            width: 120,
            sortable: true,
        },
        {
            field: 'docDate',
            headerName: t('Date'),
            type: 'string',
            width: 120,
            sortable: true,
        },
        {
            field: 'name',
            headerName: t('Name'),
            width: 280,
            sortable: true,
        },
        {
            field: 'grossPay',
            headerName: t('Gross Pay'),
            type: 'number',
            width: 160,
            sortable: true,
        },
        {
            field: 'deductions',
            headerName: t('Deductions'),
            type: 'number',
            width: 160,
            sortable: true,
        },
        {
            field: 'netPay',
            headerName: t('Net Pay'),
            type: 'number',
            width: 160,
            sortable: true,
        },
        {
            field: 'mandatoryPayments',
            headerName: t('Mandatory Payments'),
            type: 'number',
            width: 220,
            sortable: true,
        },
    ];

    const { data, isError, isLoading, error } = useQuery<IPayment[], Error>({
        queryKey: ['position', 'balance', props],
        queryFn: async () => {
            return await getPayments({ companyId, payPeriod });
        },
        enabled: !!companyId && !!payPeriod,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onAddPosition = () => {
        navigate('/people/position/?tab=details&return=true');
    };

    const onEditPosition = (positionId: number) => {
        navigate(`/people/position/${positionId}?return=true`);
    };

    const submitCallback = async (data: IPayment) => {
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await deletePosition(+id);
        }
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onShowHistory = () => {
        console.log('onShowHistory');
    };

    const onShowDeleted = () => {
        console.log('onShowDeleted');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.dateTo < maxDate()
              ? 'Dismissed'
              : !params.row?.personId
                ? 'Vacancy'
                : 'Normal';
    };

    return (
        <>
            <Toolbar
                // onAdd={onAddPosition}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                // onDelete={rowSelectionModel.length ? onDeletePosition : 'disabled'}
                // onShowDeleted={'disabled'}
                // onRestoreDeleted={'disabled'}
                // onShowHistory={'disabled'}
            />
            <DataGrid
                checkboxSelection={false}
                // rowHeight={80}
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    cardNumber: false,
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                    additionalEarnings: false,
                }}
                apiRef={gridRef}
                rows={data || []}
                columns={columns}
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
                        onEditPosition(params.row.positionId);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEditPosition(params.row.positionId)}
            />
        </>
    );
}
