import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { GridCellParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
import { Company } from '@repo/openapi';
import { useState } from 'react';
import useManagerList from '../../hooks/ManagerList.hooks';
import useGrid from '@/hooks/useGrid';

type ManagerListProps = {
    company: Company;
    managers: any[]; // TODO
};

export default function ManagerList(props: ManagerListProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { columns, onAddManager, onEditManager } = useManagerList();
    const gridRef = useGridApiRef();
    const { onPrint, onExport } = useGrid(gridRef);

    // TODO

    return (
        <>
            <Toolbar
                onAdd={onAddManager}
                onDelete={'disabled'}
                onPrint={onPrint}
                onExport={onExport}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
            />

            <DataGrid
                apiRef={gridRef}
                rows={props.managers}
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
                        onEditManager(params.row.id);
                    }
                }}
                onRowDoubleClick={() => {
                    // onEditManager(params.row.id)
                }}
            />
            {/* <ManagerForm
                open={openForm}
                setOpen={setOpenForm}
                managerId={managerId}
                submitCallback={submitCallback}
            /> */}
        </>
    );
}
