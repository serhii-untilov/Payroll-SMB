import { sumFormatter } from '@/utils/sumFormatter';
import { date2view } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePaymentListColumns() {
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
                    const mandatoryPayments =
                        (params.row?.deductions || 0) + (params.row?.funds || 0);
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
        ],
        [t],
    );
}
