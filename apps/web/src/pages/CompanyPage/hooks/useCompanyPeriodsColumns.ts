import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { sumFormatter } from '@/utils/sumFormatter';
import { toDate } from '@repo/shared';
import { isEqual } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GridColDef } from '@mui/x-data-grid';

export default function useCompanyPeriodsColumns(dateLocale: string, payPeriod: Date) {
    const { t } = useTranslation();

    return useMemo<GridColDef[]>(() => {
        return [
            {
                field: 'name',
                headerName: t('Pay Period'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (params) => {
                    return getPayPeriodName(
                        toDate(params.row.dateFrom),
                        toDate(params.row.dateTo),
                        isEqual(params.row.dateFrom, payPeriod),
                        dateLocale,
                    );
                },
            },
            {
                field: 'inBalance',
                headerName: t('In Balance'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return Number(params.value) === 0 ? '' : params.value;
                },
            },
            {
                field: 'accruals',
                headerName: t('Accruals'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'deductions',
                headerName: t('Deductions'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'taxes',
                headerName: t('Taxes'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'netPay',
                headerName: t('Net Pay'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    const netPay =
                        Number(params.row.inBalance) +
                        Number(params.row.accruals) -
                        (Number(params.row.deductions) - Number(params.row.payments));
                    return sumFormatter(netPay);
                },
            },
            {
                field: 'payments',
                headerName: t('Payments Sum'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'outBalance',
                headerName: t('Out Balance'),
                type: 'number',
                width: 190,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
        ];
    }, [t, dateLocale, payPeriod]);
}
