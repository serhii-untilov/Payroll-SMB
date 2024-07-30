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
import { PayPeriod, Position } from '@repo/openapi';
import { useState } from 'react';
import usePositionListTab from './PositionListTab.hooks';

export type PositionListTabProps = {
    positions: Position[];
    payPeriod: PayPeriod;
};

export default function PositionListTab(props: PositionListTabProps) {
    const { positions, payPeriod } = props;
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { columns, getRowStatus, onAddPosition, onEditPosition, onDeletePosition } =
        usePositionListTab({ ...props, payPeriod, rowSelectionModel });
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
