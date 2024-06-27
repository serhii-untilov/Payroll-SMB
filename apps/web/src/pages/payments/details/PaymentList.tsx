import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import {
    CalcMethod,
    IFindPayment,
    IPayment,
    PaymentStatus,
    date2view,
    dateUTC,
    maxDate,
} from '@repo/shared';
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
import { deletePayment } from '../../../services/payment.service';
import { sumFormatter } from '../../../services/utils';

type Props = IFindPayment & {
    companyPayments: boolean;
    sifPayments: boolean;
};

export function PaymentList(props: Props) {
    const { companyId, payPeriod, status } = props;
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
            width: 110,
            sortable: true,
        },
        {
            field: 'docDate',
            headerName: t('Date'),
            type: 'string',
            width: 125,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.value);
            },
        },
        {
            field: 'name',
            headerName: t('Name'),
            width: 260,
            sortable: true,
            valueGetter: (params) => {
                return params.row?.paymentType?.name;
            },
        },
        {
            field: 'baseSum',
            headerName: t('Gross Pay'),
            type: 'number',
            width: 150,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'deductions',
            headerName: t('Deductions'),
            type: 'number',
            width: 150,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'paySum',
            headerName: t('Net Pay'),
            type: 'number',
            width: 150,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'mandatoryPayments',
            headerName: t('Mandatory Payments'),
            type: 'number',
            width: 190,
            sortable: true,
            valueGetter: (params) => {
                const mandatoryPayments = (params.row?.deductions || 0) + (params.row?.funds || 0);
                return sumFormatter(mandatoryPayments);
            },
        },
        {
            field: 'total',
            headerName: t('Total'),
            type: 'number',
            width: 150,
            sortable: true,
            valueGetter: (params) => {
                const total =
                    (params.row?.paySum || 0) +
                    (params.row?.deductions || 0) +
                    (params.row?.funds || 0);
                return sumFormatter(total);
            },
        },
    ];

    const { data, isError, isLoading, error } = useQuery<IPayment[], Error>({
        queryKey: ['payment', 'list', props],
        queryFn: async () => {
            return (
                await getPayments({
                    relations: true,
                    companyId,
                    payPeriod,
                    ...(status ? { status } : {}),
                })
            ).filter(
                (o) =>
                    (props.companyPayments &&
                        o.paymentType?.calcMethod !== CalcMethod.SIF_PAYMENT) ||
                    (props.sifPayments && o.paymentType?.calcMethod === CalcMethod.SIF_PAYMENT),
            );
        },
        enabled: !!companyId && !!payPeriod,
    });

    // if (isLoading) {
    //     return <Loading />;
    // }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onAddPayment = () => {
        // navigate('/people/payment/?tab=details&return=true');
        console.log('onEditPayment');
    };

    const onEditPayment = (paymentId: number) => {
        // navigate(`/people/payment/${paymentId}?return=true`);
        console.log('onEditPayment');
    };

    const submitCallback = async (data: IPayment) => {
        await queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
    };

    const onDeletePayment = async () => {
        for (const id of rowSelectionModel) {
            await deletePayment(+id);
        }
        await queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
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
            : params.row?.status === PaymentStatus.PAYED
              ? 'Normal'
              : params.row?.dateTo && dateUTC(params.row?.dateTo) < dateUTC(new Date())
                ? 'Overdue'
                : params.row?.status === PaymentStatus.SUBMITTED
                  ? 'Todo'
                  : params.row?.status === PaymentStatus.ACCEPTED
                    ? 'Overdue'
                    : params.row?.dateFrom && dateUTC(params.row?.dateFrom) <= dateUTC(new Date())
                      ? 'Todo'
                      : 'Normal';
    };

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDeletePayment : 'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
                onShowHistory={'disabled'}
            />
            <DataGrid
                checkboxSelection={true}
                // rowHeight={80}
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    docNumber: false,
                    dateFrom: false,
                    dateTo: false,
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
                        onEditPayment(params.row.paymentId);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEditPayment(params.row.paymentId)}
            />
        </>
    );
}
