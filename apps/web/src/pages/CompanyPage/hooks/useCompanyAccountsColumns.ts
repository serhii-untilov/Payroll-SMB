import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useCompanyAccountsColumns() {
    const { t } = useTranslation();
    return useMemo<GridColDef[]>(
        () => [
            {
                field: 'accountNumber',
                headerName: t('Account Number'),
                type: 'string',
                width: 280,
                sortable: true,
            },
            {
                field: 'bank',
                headerName: t('Bank'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (params) => {
                    return params.row.bank.name;
                },
            },
            {
                field: 'currency',
                headerName: t('Currency'),
                type: 'string',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return params.row.currency.code;
                },
            },
            {
                field: 'description',
                headerName: t('Description'),
                type: 'string',
                width: 160,
                sortable: true,
            },
        ],
        [t],
    );
}
