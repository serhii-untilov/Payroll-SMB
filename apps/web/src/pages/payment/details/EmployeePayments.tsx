import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { paymentsRemove } from '@/services/payment.service';
import { paymentPositionsFindAll } from '@/services/paymentPosition.service';
import { snackbarError, sumFormatter } from '@/utils';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { PaymentPosition } from '@repo/openapi';
import { PaymentStatus, ResourceType, dateUTC } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    paymentId: number;
};

export function EmployeePayments(props: Props) {
    const { paymentId } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();

    const columns: GridColDef[] = [
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

    const { data, isError, error } = useQuery<PaymentPosition[], Error>({
        queryKey: [ResourceType.PAYMENT, { paymentId, relations: true }],
        queryFn: async () => {
            return await paymentPositionsFindAll({ paymentId, relations: true });
        },
        enabled: !!paymentId,
    });

    if (isError) {
        return snackbarError(`${error.name}\n${error.message}`);
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
        await queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
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
