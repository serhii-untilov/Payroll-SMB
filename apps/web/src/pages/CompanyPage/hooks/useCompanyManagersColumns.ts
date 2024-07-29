import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useCompanyManagersColumns() {
    const { t } = useTranslation();

    return useMemo<GridColDef[]>(
        () => [
            {
                field: 'fullName',
                headerName: t('Full Name'),
                type: 'string',
                width: 290,
                sortable: true,
                valueGetter: (params) => {
                    return `${params.row.firstName} ${params.row.lastName}`;
                },
            },
            {
                field: 'job',
                headerName: t('Job'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (_params) => {
                    return '';
                },
            },
            {
                field: 'department',
                headerName: t('Department'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (_params) => {
                    return '';
                },
            },
            {
                field: 'taxId',
                headerName: t('Tax ID'),
                type: 'string',
                width: 220,
                sortable: true,
                valueGetter: (_params) => {
                    return '';
                },
            },
            {
                field: 'phone',
                headerName: t('Phone'),
                type: 'string',
                width: 160,
                sortable: true,
                valueGetter: (_params) => {
                    return '';
                },
            },
            {
                field: 'email',
                headerName: t('Email Address'),
                type: 'string',
                width: 220,
                sortable: true,
                valueGetter: (_params) => {
                    return '';
                },
            },
        ],
        [t],
    );
}
