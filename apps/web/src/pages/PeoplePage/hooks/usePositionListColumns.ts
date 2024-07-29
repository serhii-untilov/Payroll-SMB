import { date2view } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePositionListColumns(payPeriod: Date) {
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                field: 'cardNumber',
                headerName: t('Card Number'),
                type: 'string',
                width: 100,
                sortable: true,
            },
            {
                field: 'name',
                headerName: t('Position'),
                type: 'string',
                width: 250,
                // Warning: Failed prop type: MUI: `column.resizable = true` is not a valid prop.
                // Column resizing is not available in the MIT version.
                // resizable: true,
                sortable: true,
                valueGetter: (params) => {
                    return params.row?.personId ? params.row?.person?.fullName || '' : t('Vacancy');
                },
            },
            {
                field: 'job',
                headerName: t('Job'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.job?.name || ''
                        : '';
                },
            },
            {
                field: 'department',
                headerName: t('Department'),
                type: 'string',
                width: 300,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.department?.name || ''
                        : '';
                },
            },
            {
                field: 'workNorm',
                headerName: t('Work Norm'),
                type: 'string',
                width: 250,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.workNorm?.name || ''
                        : '';
                },
            },
            {
                field: 'paymentType',
                headerName: t('Payment Form'),
                type: 'string',
                width: 190,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.paymentType?.name || ''
                        : '';
                },
            },
            {
                field: 'wage',
                headerName: t('Wage'),
                type: 'number',
                width: 110,
                sortable: true,
                valueGetter: (params) => {
                    const wage = payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.wage || ''
                        : '';
                    return Number(wage) === 0 ? '' : wage;
                },
            },
            {
                field: 'rate',
                headerName: t('Rate'),
                type: 'number',
                width: 80,
                sortable: true,
                valueGetter: (params) => {
                    return payPeriod
                        ? params.row?.history?.find(
                              (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                          )?.rate || ''
                        : '';
                },
            },
            {
                field: 'dateFrom',
                headerName: t('Date From'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.value);
                },
            },
            {
                field: 'dateTo',
                headerName: t('Date To'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.value);
                },
            },
        ],
        [t, payPeriod],
    );
}
