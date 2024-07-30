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
import { Payment } from '@repo/openapi';
import { useState } from 'react';
import useForm from '../hooks/usePaymentList';
import useColumns from '../hooks/usePaymentListColumns';

interface PaymentListTabProps {
    payments: Payment[];
}

export function PaymentListTab({ payments }: PaymentListTabProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const columns = useColumns();
    const { onAddPayment, onEditPayment, onDeletePayment, getRowStatus } = useForm({
        payments,
        rowSelectionModel,
    });
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={payments?.length ? onPrint : 'disabled'}
                onExport={payments?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDeletePayment : 'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
                onShowHistory={'disabled'}
            />
            <DataGrid
                checkboxSelection={true}
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    docNumber: false,
                    dateFrom: false,
                    dateTo: false,
                }}
                apiRef={gridRef}
                rows={payments || []}
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
                        onEditPayment(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.id)}
            />
        </>
    );
}
