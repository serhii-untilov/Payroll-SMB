import { paymentsRemove } from '@/services/api/payment.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { PaymentStatus, ResourceType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function useEmployeePayments(
    gridRef: any,
    rowSelectionModel: GridRowSelectionModel,
) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
        getRowStatus,
        onAddPayment,
        onEditPayment,
        onPrint,
        onExport,
        onDeletePayment,
    };
}
