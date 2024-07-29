import { useNavigate } from 'react-router-dom';

export default function useMandatoryPayments(gridRef: any) {
    const navigate = useNavigate();

    const onAddPayment = () => console.log('onEditPayment');
    const onDeletePayment = async () => console.log('onDeletePayment');

    const onEditPayment = (id: number) => navigate(`/payments/${id}`);
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    return { onAddPayment, onDeletePayment, onEditPayment, onPrint, onExport };
}
