import { paymentsRemove } from '@/services/api/payment.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Payment, PaymentStatus, ResourceType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function usePaymentList(
    payments: Payment[],
    gridRef: any,
    rowSelectionModel: GridRowSelectionModel,
) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // TODO

    const onAddPayment = () => console.log('onAddPayment');

    const onEditPayment = (id: number) => navigate(`/payments/${id}`);
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    const onDeletePayment = async () => {
        for (const id of rowSelectionModel) {
            const payment = payments.find((o) => o.id === Number(id));
            if (payment?.status === PaymentStatus.Draft) {
                await paymentsRemove(+id);
            }
        }
        await invalidateQueries(queryClient, [ResourceType.Payment, ResourceType.PaymentPosition]);
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

    return { onAddPayment, onEditPayment, onPrint, onExport, onDeletePayment, getRowStatus };
}
