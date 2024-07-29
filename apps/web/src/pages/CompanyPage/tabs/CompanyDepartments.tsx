import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useDepartments } from '@/hooks/queries/useDepartments';
import DepartmentForm from '@/pages/department/DepartmentForm';
import { departmentsRemove } from '@/services/api/department.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, ResourceType } from '@repo/openapi';
import { date2view } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    company: Company;
};

export function CompanyDepartments({ company }: Props) {
    const [openForm, setOpenForm] = useState(false);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const { data, isLoading } = useDepartments({ companyId: company.id, relations: true });
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const columns = useColumns();

    const onAddDepartment = () => {
        setDepartmentId(null);
        setOpenForm(true);
    };

    const onEditDepartment = (departmentId: number) => {
        setDepartmentId(departmentId);
        setOpenForm(true);
    };

    const submitCallback = async () => {
        await invalidateQueries(queryClient, [ResourceType.Department]);
    };

    const onDeleteDepartment = async () => {
        for (const id of rowSelectionModel) {
            await departmentsRemove(+id);
        }
        await invalidateQueries(queryClient, [ResourceType.Department]);
    };

    const onTreeView = () => console.log('onTreeView');
    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();

    if (isLoading) return <LoadingDisplay />;

    return (
        <>
            <Toolbar
                onAdd={onAddDepartment}
                onDelete={rowSelectionModel.length ? onDeleteDepartment : 'disabled'}
                onTreeView={onTreeView}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={data ?? []}
                columns={columns}
                checkboxSelection={true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEditDepartment(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditDepartment(params.row.id)}
            />
            <DepartmentForm
                open={openForm}
                setOpen={setOpenForm}
                departmentId={departmentId}
                submitCallback={submitCallback}
            />
        </>
    );
}

function useColumns() {
    const { t } = useTranslation();
    const columns: GridColDef[] = useMemo(() => {
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
    return columns;
}
