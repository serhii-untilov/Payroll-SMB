import { GridColDef } from '@mui/x-data-grid';
import { date2view } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useCompanyDepartmentsColumns() {
    const { t } = useTranslation();
    return useMemo<GridColDef[]>(() => {
        return [
            {
                field: 'name',
                headerName: t('Department'),
                type: 'string',
                width: 400,
                sortable: true,
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
            {
                field: 'parentDepartment',
                headerName: t('Parent Department'),
                type: 'string',
                width: 250,
                sortable: true,
                valueGetter: (params) => {
                    return params.row.parentDepartment?.name ?? '';
                },
            },
        ];
    }, [t]);
}
