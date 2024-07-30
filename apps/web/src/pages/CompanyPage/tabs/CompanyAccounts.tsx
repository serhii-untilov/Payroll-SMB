import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { GridCellParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
import { useState } from 'react';
import useForm from '../hooks/useCompanyAccounts';
import useColumns from '../hooks/useCompanyAccountsColumns';
import { Company } from '@repo/openapi';
import useGrid from '@/hooks/useGrid';

type Props = {
    company: Company;
};

export function CompanyAccounts(_params: Props) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const columns = useColumns();
    const { onAddAccount, onEditAccount } = useForm();
    const gridRef = useGridApiRef();
    const { onPrint, onExport } = useGrid(gridRef);

    // TODO: Split into two components: data retrieval and form.

    return (
        <>
            <Toolbar
                onAdd={onAddAccount}
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
                        onEditAccount(params.row.id);
                    }
                }}
                onRowDoubleClick={() => {
                    // onEditAccount(params.row.id)
                }}
            />
        </>
    );
}
