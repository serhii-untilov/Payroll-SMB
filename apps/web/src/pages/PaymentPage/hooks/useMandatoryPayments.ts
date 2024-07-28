import { sumFormatter } from '@/utils/sumFormatter';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function useMandatoryPayments(gridRef: any) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const columns = useMemo(() => getColumns(t), [t]);
    const onAddPayment = () => console.log('onEditPayment');
    const onDeletePayment = async () => console.log('onDeletePayment');

    const onEditPayment = (id: number) => navigate(`/payments/${id}`);
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    return { columns, onAddPayment, onDeletePayment, onEditPayment, onPrint, onExport };
}

function getColumns(t: any) {
    return [
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
    ];
}
