import { sumFormatter } from '@/utils/sumFormatter';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MandatoryPaymentListProps } from './MandatoryPaymentList';

export default function useMandatoryPaymentList(_props: MandatoryPaymentListProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // TODO
    const onAddPayment = useCallback(() => console.log('onEditPayment'), []);
    const onDeletePayment = useCallback(async () => console.log('onDeletePayment'), []);
    const onEditPayment = useCallback((id: string) => navigate(`/payments/${id}`), [navigate]);

    const columns = useMemo(
        () => [
            {
                field: 'name',
                headerName: t('Name'),
                width: 280,
                sortable: true,
                valueGetter: (params) => {
                    return params.row?.paymentType?.name;
                },
            },
            {
                field: 'incomeSum',
                headerName: t('Income Sum'),
                type: 'number',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'baseSum',
                headerName: t('Base Sum'),
                type: 'number',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'rate',
                headerName: t('Rate'),
                type: 'number',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'paySum',
                headerName: t('Payment Sum'),
                type: 'number',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
        ],
        [t],
    );

    return { columns, onAddPayment, onDeletePayment, onEditPayment };
}
