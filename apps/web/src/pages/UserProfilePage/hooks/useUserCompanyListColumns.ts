import { GridColDef } from '@mui/x-data-grid';
import { date2view } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useUserCompanyListColumns() {
    const { t } = useTranslation();

    return useMemo<GridColDef[]>(
        () => [
            {
                field: 'companyName',
                headerName: t('Company'),
                type: 'string',
                width: 400,
                sortable: true,
                valueGetter: (params) => {
                    return params.row.company?.name;
                },
            },
            {
                field: 'roleName',
                headerName: t('User Role'),
                type: 'string',
                width: 400,
                sortable: true,
                valueGetter: (params) => {
                    return params.row.role.name;
                },
            },
            {
                field: 'payPeriod',
                headerName: t('Pay Period'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.row.company?.payPeriod);
                },
            },
            {
                field: 'dateFrom',
                headerName: t('Date From'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.row.company?.dateFrom);
                },
            },

            {
                field: 'dateTo',
                headerName: t('Date To'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params) => {
                    return date2view(params.row.company?.dateTo);
                },
            },
        ],
        [t],
    );
}
