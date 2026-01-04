import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { GridCellParams, GridRowParams, GridRowSelectionModel, MuiEvent, useGridApiRef } from '@mui/x-data-grid';
import useGrid from '@/hooks/useGrid';
import { useState } from 'react';
import useEmployeePaymentList from './EmployeePaymentList.hooks';

const EmployeePaymentsList = ({ paymentList }) => {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { columns, getRowStatus, onAddPayment, onEditPayment, onDeletePayment } =
        useEmployeePaymentList(rowSelectionModel);
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={paymentList?.length ? onPrint : 'disabled'}
                onExport={paymentList?.length ? onExport : 'disabled'}
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
                rows={paymentList || []}
                columns={columns}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel.map(String));
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(params: GridCellParams, event: MuiEvent<React.KeyboardEvent<HTMLElement>>) => {
                    if (event.code === 'Enter') {
                        onEditPayment(params.row.position.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.position.id)}
            />
        </>
    );
};

export default EmployeePaymentsList;
