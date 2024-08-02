import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import useGrid from '@/hooks/useGrid';
import {
    GridCallbackDetails,
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { User, UserCompany } from '@repo/openapi';
import { useState } from 'react';
import useUserCompanyList from './UserCompanyList.hooks';

type UserCompanyListProps = {
    user: User;
    userCompanyList: UserCompany[];
    showDeleted: boolean;
    setShowDeleted: (showDeleted: boolean) => void;
};

const UserCompanyList = (props: UserCompanyListProps) => {
    const { userCompanyList: userCompanies, showDeleted, setShowDeleted } = props;
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { onPrint, onExport } = useGrid(gridRef);
    const {
        columns,
        onAddCompany,
        onSelectCompany,
        onDeleteCompany,
        deletedSelection,
        notDeletedSelection,
        onRestoreDeleted,
        onShowDeleted,
        getRowStatus,
    } = useUserCompanyList({
        userCompanies,
        rowSelectionModel,
        setRowSelectionModel,
        gridRef,
        showDeleted,
        setShowDeleted,
    });

    return (
        <>
            <Toolbar
                onAdd={onAddCompany}
                onDelete={notDeletedSelection().length ? onDeleteCompany : 'disabled'}
                onPrint={userCompanies?.length ? onPrint : 'disabled'}
                onExport={userCompanies?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={onShowDeleted}
                onRestoreDeleted={
                    showDeleted && deletedSelection().length ? onRestoreDeleted : 'disabled'
                }
            />
            <DataGrid
                getRowStatus={getRowStatus}
                apiRef={gridRef}
                rows={userCompanies || []}
                columns={columns}
                checkboxSelection={true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                    _details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onSelectCompany(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    _event: MuiEvent,
                    _details: GridCallbackDetails,
                ) => onSelectCompany(params.row.id)}
            />
        </>
    );
};

export default UserCompanyList;
