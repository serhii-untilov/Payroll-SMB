import { DataGrid, Toolbar } from '@/components';
import { usePaymentList } from '@/hooks';
import { paymentsRemove } from '@/services';
import { invalidateQueries, sumFormatter } from '@/utils';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { CalcMethod, FindAllPaymentDto, Payment, PaymentStatus, ResourceType } from '@repo/openapi';
import { date2view, dateUTC } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
type Props = FindAllPaymentDto & {
    companyPayments: boolean;
    sifPayments: boolean;
};

export function PaymentList(props: Props) {
    const { companyId, payPeriod, status } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const columns = useMemo(() => getColumns(t), [t]);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();
    const params = { relations: true, companyId, payPeriod, ...(status ? { status } : {}) };
    const { data: rawData } = usePaymentList(params);
    const data = useMemo(() => filteredPaymentList(rawData, props), [rawData, props]);

    const onAddPayment = () => console.log('onAddPayment');
    const onEditPayment = (id: number) => navigate(`/payments/${id}`);
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    const onDeletePayment = async () => {
        for (const id of rowSelectionModel) {
            const payment = data?.find((o) => o.id === Number(id));
            if (payment?.status === PaymentStatus.Draft) {
                await paymentsRemove(+id);
            }
        }
        await invalidateQueries(queryClient, [ResourceType.Payment, ResourceType.PaymentPosition]);
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
                        onEditPayment(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.id)}
            />
        </>
    );
}

function getColumns(t: any): GridColDef[] {
    return [
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
}

function getRowStatus(params: any): string {
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
}

function filteredPaymentList(rawData: Payment[], props: Props) {
    return rawData.filter(
        (o) =>
            (props.companyPayments && o.paymentType?.calcMethod !== CalcMethod.SifPayment) ||
            (props.sifPayments && o.paymentType?.calcMethod === CalcMethod.SifPayment),
    );
}
