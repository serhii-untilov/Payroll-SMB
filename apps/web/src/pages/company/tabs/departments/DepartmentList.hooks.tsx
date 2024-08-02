import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { departmentsRemove } from '@/services/api/department.service';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { date2view } from '@repo/shared';
import { Dispatch, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface DepartmentListParams {
    setOpenForm: Dispatch<boolean>;
    setDepartmentId: Dispatch<number | null>;
    rowSelectionModel: GridRowSelectionModel;
    gridRef: any;
}

export default function useDepartmentList(params: DepartmentListParams) {
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();

    const columns = useMemo<GridColDef[]>(
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

    const onAddDepartment = useCallback(() => {
        params.setDepartmentId(null);
        params.setOpenForm(true);
    }, [params]);

    const onEditDepartment = useCallback(
        (departmentId: number) => {
            params.setDepartmentId(departmentId);
            params.setOpenForm(true);
        },
        [params],
    );

    const onDeleteDepartment = useCallback(async () => {
        for (const id of params.rowSelectionModel) {
            await departmentsRemove(+id);
        }
        await invalidateQueries([ResourceType.Department]);
    }, [params, invalidateQueries]);

    // TODO
    const onTreeView = useCallback(() => console.log('onTreeView'), []);

    return { columns, onAddDepartment, onEditDepartment, onDeleteDepartment, onTreeView };
}
