import { useNavigate } from 'react-router-dom';

export default function useMandatoryPayments() {
    const navigate = useNavigate();

    const onAddPayment = () => console.log('onEditPayment');
    const onDeletePayment = async () => console.log('onDeletePayment');

    const onEditPayment = (id: number) => navigate(`/payments/${id}`);

    return { onAddPayment, onDeletePayment, onEditPayment };
}
