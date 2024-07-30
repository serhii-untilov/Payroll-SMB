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
import { Company, PayPeriod, PositionBalanceExtendedDto } from '@repo/openapi';
import { useState } from 'react';
import usePayrollList from './PayrollList.hooks';

export type PayrollListProps = {
    company: Company;
    payPeriod: PayPeriod;
    balances: PositionBalanceExtendedDto[];
};

export default function PayrollList(props: PayrollListProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { onPrint, onExport } = useGrid(gridRef);
    const { columns, onEditPosition, getRowStatus } = usePayrollList({
        ...props,
        gridRef,
        rowSelectionModel,
    });

    return (
        <>
            <Toolbar
                onPrint={props.balances.length ? onPrint : 'disabled'}
                onExport={props.balances.length ? onExport : 'disabled'}
            />
            <DataGrid
                checkboxSelection={false}
                rowHeight={80}
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    cardNumber: false,
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                    additionalEarnings: false,
                }}
                apiRef={gridRef}
                rows={props.balances || []}
                columns={columns}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                ) => {
                    if (event.code === 'Enter') {
                        onEditPosition(params.row.positionId);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPosition(params.row.positionId)}
            />
        </>
    );
}
