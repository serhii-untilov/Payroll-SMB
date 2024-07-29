import { sumFormatter } from '@/utils/sumFormatter';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useEmployeePaymentsColumns() {
    const { t } = useTranslation();
    return useMemo(() => getColumns(t), [t]);
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
