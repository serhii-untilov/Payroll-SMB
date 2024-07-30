import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import useAppContext from '@/hooks/context/useAppContext';
import {
    GridCallbackDetails,
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Position } from '@repo/openapi';
import { useState } from 'react';
import useColumns from '../hooks/usePositionListColumns';
import useForm from '../hooks/usePositionList';
import useGrid from '@/hooks/useGrid';

interface PositionListTabProps {
    positions: Position[];
}

export default function PositionListTab({ positions }: PositionListTabProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { payPeriod } = useAppContext();
    const columns = useColumns(payPeriod);
    const { getRowStatus, onAddPosition, onEditPosition, onDeletePosition } =
        useForm(rowSelectionModel);
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddPosition}
                onPrint={positions?.length ? onPrint : 'disabled'}
                onExport={positions?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDeletePosition : 'disabled'}
                onRestoreDeleted={'disabled'}
                onShowHistory={'disabled'}
            />
            <DataGrid
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                }}
                apiRef={gridRef}
                rows={positions || []}
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
                        onEditPosition(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    _event: MuiEvent,
                    _details: GridCallbackDetails,
                ) => onEditPosition(params.row.id)}
            />
        </>
    );
}
