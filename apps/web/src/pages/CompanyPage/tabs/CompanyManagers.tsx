import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { GridCellParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
import { Company } from '@repo/openapi';
import { useState } from 'react';
import useForm from '../hooks/useCompanyManagers';
import useColumns from '../hooks/useCompanyManagersColumns';
import useGrid from '@/hooks/useGrid';

type Props = {
    company: Company;
};

export function CompanyManagers(_params: Props) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const columns = useColumns();
    const { onAddManager, onEditManager } = useForm();
    const gridRef = useGridApiRef();
    const { onPrint, onExport } = useGrid(gridRef);

    // TODO: Split into two components: data retrieval and form.

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
                rows={[]}
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
