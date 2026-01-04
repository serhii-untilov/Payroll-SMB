import { useRemovePayment, useRestorePayment } from '@/hooks/queries/usePayment';
import { sumFormatter } from '@/utils/sumFormatter';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { PaymentStatus } from '@repo/openapi';
import { date2view, dateUTC } from '@repo/shared';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaymentListTabProps } from './PaymentListTab';

type PaymentListTabParams = PaymentListTabProps & {
    rowSelectionModel: GridRowSelectionModel;
};

export default function usePaymentListTab(params: PaymentListTabParams) {
    const { payments, rowSelectionModel } = params;
    const navigate = useNavigate();
    const removePayment = useRemovePayment();
    const restorePayment = useRestorePayment();

    // TODO
    const onAddPayment = useCallback(() => console.log('onAddPayment'), []);
    const onEditPayment = useCallback((id: string) => navigate(`/payments/${id}`), [navigate]);

    const onDeletePayment = useCallback(async () => {
        for (const id of rowSelectionModel.map(String)) {
            const payment = payments.find((o) => o.id === id);
            if (payment?.status === PaymentStatus.Draft) {
                await removePayment.mutateAsync(id);
            }
        }
    }, [payments, removePayment, rowSelectionModel]);

    const onShowDeleted = useCallback(() => {
        params.setShowDeleted(!params.showDeleted);
    }, [params]);

    const canRestore = useMemo<boolean>(
        () =>
            !!rowSelectionModel.find((id) =>
                payments.find(
                    (payment) => payment.id === id && payment.status === PaymentStatus.Draft && payment.deletedDate,
                ),
            ),
        [rowSelectionModel, payments],
    );

    const canDelete = useMemo<boolean>(
        () =>
            !!rowSelectionModel.find((id) =>
                payments.find(
                    (payment) => payment.id === id && payment.status === PaymentStatus.Draft && !payment.deletedDate,
                ),
            ),
        [rowSelectionModel, payments],
    );

    const onRestoreDeleted = useCallback(async () => {
        for (const id of rowSelectionModel.map(String)) {
            const payment = payments.find((o) => o.id === id);
            if (payment?.status === PaymentStatus.Draft && payment.deletedDate) {
                await restorePayment.mutateAsync(id);
            }
        }
    }, [payments, restorePayment, rowSelectionModel]);

    const getRowStatus = useCallback((params: any): string => {
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
    }, []);

    const columns = useColumns();

    return {
        columns,
        onAddPayment,
        onEditPayment,
        onDeletePayment,
        onShowDeleted,
        canDelete,
        canRestore,
        onRestoreDeleted,
        getRowStatus,
    };
}

function useColumns() {
    const { t } = useTranslation();
    return useMemo(
        () => [
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
                    const total = (params.row?.paySum || 0) + (params.row?.deductions || 0) + (params.row?.funds || 0);
                    return sumFormatter(total);
                },
            },
        ],
        [t],
    );
}
