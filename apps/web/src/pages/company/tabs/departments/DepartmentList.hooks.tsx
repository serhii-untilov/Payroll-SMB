import { useRemoveDepartment } from '@/hooks/queries/useDepartment';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { date2view } from '@repo/shared';
import { Dispatch, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface DepartmentListParams {
    setOpenForm: Dispatch<boolean>;
    setDepartmentId: Dispatch<string>;
    rowSelectionModel: GridRowSelectionModel;
    gridRef: any;
}

export default function useDepartmentList(params: DepartmentListParams) {
    const removeDepartment = useRemoveDepartment();
    const columns = useColumns();

    const onAddDepartment = useCallback(() => {
        params.setDepartmentId('');
        params.setOpenForm(true);
    }, [params]);

    const onEditDepartment = useCallback(
        (departmentId: string) => {
            params.setDepartmentId(departmentId);
            params.setOpenForm(true);
        },
        [params],
    );

    const onDeleteDepartment = useCallback(async () => {
        for (const id of params.rowSelectionModel.map(String)) {
            await removeDepartment.mutateAsync(id);
        }
    }, [params.rowSelectionModel, removeDepartment]);

    // TODO
    const onTreeView = useCallback(() => console.log('onTreeView'), []);

    return { columns, onAddDepartment, onEditDepartment, onDeleteDepartment, onTreeView };
}

function useColumns() {
    const { t } = useTranslation();
    return useMemo<GridColDef[]>(
        () => [
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
        ],
        [t],
    );
}
