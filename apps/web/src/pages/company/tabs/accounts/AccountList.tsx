import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { GridCellParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
import { useState } from 'react';
import useAccountList from '../../hooks/AccountList.hooks';

import { Company } from '@repo/openapi';
import useGrid from '@/hooks/useGrid';

type AccountListProps = {
    company: Company;
    accounts: any[]; // TODO
};

export default function AccountsList(props: AccountListProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { columns, onAddAccount, onEditAccount } = useAccountList();
    const { onPrint, onExport } = useGrid(gridRef);

    // TODO

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
                rows={props.accounts}
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
