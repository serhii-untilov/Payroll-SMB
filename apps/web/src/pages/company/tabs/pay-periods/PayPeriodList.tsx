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
import { Company, PayPeriod } from '@repo/openapi';
import { useState } from 'react';
import usePayPeriodList from './PayPeriodList.hooks';

export type PayPeriodListProps = {
    company: Company;
    payPeriods: PayPeriod[];
    currentPayPeriod: PayPeriod | undefined;
};

export function PayPeriodList(props: PayPeriodListProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { payPeriods, columns, onEdit, onCalculate, onClose, onOpen } = usePayPeriodList(props);
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onCalculate={onCalculate}
                onClose={onClose}
                onOpen={onOpen}
                onPrint={payPeriods?.length ? onPrint : 'disabled'}
                onExport={payPeriods?.length ? onExport : 'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={payPeriods || []}
                columns={columns}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    taxes: false,
                }}
                checkboxSelection={false}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel.map(String));
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEdit(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEdit(params.row.id)}
            />
        </>
    );
}
