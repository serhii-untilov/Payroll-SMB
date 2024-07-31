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
import { Dispatch, useState } from 'react';
import usePaymentListTab from './PaymentListTab.hooks';

export interface PaymentListTabProps {
    payments: Payment[];
    showDeleted: boolean;
    setShowDeleted: Dispatch<boolean>;
}

export function PaymentListTab(props: PaymentListTabProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const {
        columns,
        onAddPayment,
        onEditPayment,
        onDeletePayment,
        onShowDeleted,
        canDelete,
        canRestore,
        onRestoreDeleted,
        getRowStatus,
    } = usePaymentListTab({
        ...props,
        rowSelectionModel,
    });
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={props.payments?.length ? onPrint : 'disabled'}
                onExport={props.payments?.length ? onExport : 'disabled'}
                onDelete={canDelete ? onDeletePayment : 'disabled'}
                onShowDeleted={onShowDeleted}
                onRestoreDeleted={canRestore ? onRestoreDeleted : 'disabled'}
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
                rows={props.payments || []}
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
