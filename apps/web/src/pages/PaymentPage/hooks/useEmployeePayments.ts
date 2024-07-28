import { paymentsRemove } from '@/services/payment.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { sumFormatter } from '@/utils/sumFormatter';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { PaymentStatus, ResourceType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function useEmployeePayments(
    gridRef: any,
    rowSelectionModel: GridRowSelectionModel,
) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const columns = useMemo(() => getColumns(t), [t]);

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

    const onAddPayment = () => console.log('onAddPayment');
    const onEditPayment = (id: number) => navigate(`/people/position/${id}?return=true`);
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    const onDeletePayment = async () => {
        for (const id of rowSelectionModel) {
            await paymentsRemove(+id);
        }
        await invalidateQueries(queryClient, [ResourceType.Payment, ResourceType.PaymentPosition]);
    };

    return {
        columns,
        getRowStatus,
        onAddPayment,
        onEditPayment,
        onPrint,
        onExport,
        onDeletePayment,
    };
}

function getColumns(t: any) {
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
