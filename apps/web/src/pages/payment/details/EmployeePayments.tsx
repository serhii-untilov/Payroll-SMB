import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { paymentsRemove } from '@/services/payment.service';
import { paymentPositionsFindAll } from '@/services/paymentPosition.service';
import { invalidateQueries, snackbarError, sumFormatter } from '@/utils';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { PaymentPosition } from '@repo/openapi';
import { PaymentStatus, ResourceType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    paymentId: number;
};

export function EmployeePayments(props: Props) {
    const { paymentId } = props;
    const { t } = useTranslation();
    const columns = useMemo(() => getColumns(t), [t]);
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();

    const { data, isError, error } = useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.Payment, { paymentId, relations: true }],
        queryFn: async () => {
            return await paymentPositionsFindAll({ paymentId, relations: true });
        },
        enabled: !!paymentId,
    });

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }

    const onAddPayment = () => {
        console.log('onAddPayment');
    };

    const onEditPayment = (id: number) => {
        navigate(`/people/position/${id}?return=true`);
    };

    const onDeletePayment = async () => {
        for (const id of rowSelectionModel) {
            await paymentsRemove(+id);
        }
        await invalidateQueries(queryClient, [ResourceType.Payment]);
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.status === PaymentStatus.Paid
              ? 'Normal'
              : params.row?.dateTo && dateUTC(params.row?.dateTo) < dateUTC(new Date())
                ? 'Overdue'
                : params.row?.status === PaymentStatus.Submitted
                  ? 'Todo'
                  : params.row?.status === PaymentStatus.Accepted
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
                ) => {
                    if (event.code === 'Enter') {
                        onEditPayment(params.row.position.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.position.id)}
            />
        </>
    );
}

function getColumns(t: any): GridColDef[] {
    return [
        {
            field: 'cardNumber',
            headerName: t('Card Number'),
            type: 'string',
            width: 110,
            sortable: true,
            valueGetter: (params) => {
                return params.row.position.cardNumber;
            },
        },
        {
            field: 'fullName',
            headerName: t('Full Name'),
            width: 260,
            sortable: true,
            valueGetter: (params) => {
                return params.row.position.person.fullName;
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
}
