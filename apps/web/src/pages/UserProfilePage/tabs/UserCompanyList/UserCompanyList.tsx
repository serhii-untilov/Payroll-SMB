import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
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
import useForm from '../../hooks/useUserCompanyList';
import useColumns from '../../hooks/useUserCompanyListColumns';

type UserCompanyListProps = {
    user: User;
    userCompanies: UserCompany[];
    showDeleted: boolean;
    setShowDeleted: (showDeleted: boolean) => void;
};

export function UserCompanyList(props: UserCompanyListProps) {
    const { userCompanies, showDeleted, setShowDeleted } = props;
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const columns = useColumns();
    const {
        onAddCompany,
        onSelectCompany,
        onDeleteCompany,
        deletedSelection,
        notDeletedSelection,
        onRestoreDeleted,
        onPrint,
        onExport,
        onShowDeleted,
        getRowStatus,
    } = useForm({
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
}
