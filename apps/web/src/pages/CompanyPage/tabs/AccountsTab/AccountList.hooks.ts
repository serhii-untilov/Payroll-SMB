import { GridColDef } from '@mui/x-data-grid';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useAccountList() {
    const { t } = useTranslation();

    // TODO

    const onAddAccount = useCallback(() => {
        console.log('onAdd');
    }, []);

    const onEditAccount = useCallback((_accountId: number) => {
        console.log('onEdit');
    }, []);

    const columns = useMemo<GridColDef[]>(
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

    return { columns, onAddAccount, onEditAccount };
}
