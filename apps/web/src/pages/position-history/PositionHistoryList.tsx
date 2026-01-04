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
import { Position, PositionHistory } from '@repo/openapi';
import { useState } from 'react';
import usePositionHistoryList from './PositionHistoryList.hooks';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';

export type PositionHistoryListProps = {
    position: Position;
    history: PositionHistory[];
};

export default function PositionHistoryList(props: PositionHistoryListProps) {
    const gridRef = useGridApiRef();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { pageTitle, columns, onAdd, onEdit, onDelete, getRowStatus } = usePositionHistoryList(props);
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <PageLayout>
                <PageTitle goBack={true}>{pageTitle}</PageTitle>
                <Toolbar
                    onAdd={onAdd}
                    onPrint={props.history.length ? onPrint : 'disabled'}
                    onExport={props.history?.length ? onExport : 'disabled'}
                    onDelete={rowSelectionModel.length ? onDelete : 'disabled'}
                />
                <DataGrid
                    getRowStatus={getRowStatus}
                    apiRef={gridRef}
                    rows={props.history ?? []}
                    columns={columns}
                    checkboxSelection={true}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel.map(String));
                    }}
                    rowSelectionModel={rowSelectionModel}
                    onCellKeyDown={(
                        params: GridCellParams,
                        event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                        _details: GridCallbackDetails,
                    ) => {
                        if (event.code === 'Enter') {
                            onEdit(params.row.id);
                        }
                    }}
                    onRowDoubleClick={(params: GridRowParams, _event: MuiEvent, _details: GridCallbackDetails) =>
                        onEdit(params.row.id)
                    }
                />
            </PageLayout>
        </>
    );
}
