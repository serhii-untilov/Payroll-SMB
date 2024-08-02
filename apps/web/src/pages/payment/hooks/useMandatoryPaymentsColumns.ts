import { sumFormatter } from '@/utils/sumFormatter';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useMandatoryPaymentsColumns() {
    const { t } = useTranslation();
    return useMemo(() => getColumns(t), [t]);
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
