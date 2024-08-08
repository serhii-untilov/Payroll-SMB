import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, Payment, PayPeriod } from '@repo/openapi';
import { useState } from 'react';
import useMandatoryPaymentList from './MandatoryPaymentList.hooks';
import useGrid from '@/hooks/useGrid';

export type MandatoryPaymentListProps = {
    company: Company;
    payPeriod: PayPeriod;
    payment: Payment;
    paymentList: any[];
};
export function MandatoryPaymentList(props: MandatoryPaymentListProps) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { columns, onAddPayment, onDeletePayment, onEditPayment } =
        useMandatoryPaymentList(props);
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={props.paymentList?.length ? onPrint : 'disabled'}
                onExport={props.paymentList?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDeletePayment : 'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
                onShowHistory={'disabled'}
            />
            <DataGrid
                checkboxSelection={true}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    docNumber: false,
                    dateFrom: false,
                    dateTo: false,
                }}
                apiRef={gridRef}
                rows={props.paymentList || []}
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
