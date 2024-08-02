import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import useGrid from '@/hooks/useGrid';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, Department } from '@repo/openapi';
import { useState } from 'react';
import DepartmentDialog from './department/DepartmentDialog';
import useDepartmentList from './DepartmentList.hooks';

export type DepartmentListProps = {
    company: Company;
    departments: Department[];
};

export default function DepartmentList(props: DepartmentListProps) {
    const { departments } = props;
    const [openForm, setOpenForm] = useState(false);
    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { columns, onAddDepartment, onEditDepartment, onDeleteDepartment, onTreeView } =
        useDepartmentList({
            setOpenForm,
            setDepartmentId,
            rowSelectionModel,
            gridRef,
        });
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddDepartment}
                onDelete={rowSelectionModel.length ? onDeleteDepartment : 'disabled'}
                onTreeView={onTreeView}
                onPrint={departments?.length ? onPrint : 'disabled'}
                onExport={departments?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={departments}
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
            <DepartmentDialog
                open={openForm}
                setOpen={setOpenForm}
                departmentId={departmentId}
                setDepartmentId={setDepartmentId}
            />
        </>
    );
}
