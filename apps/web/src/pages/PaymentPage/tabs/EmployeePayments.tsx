import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { usePaymentPositions } from '@/hooks/queries/usePayments';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, Payment } from '@repo/openapi';
import { useState } from 'react';
import useForm from '../hooks/useEmployeePayments';
import useColumns from '../hooks/useEmployeePaymentsColumns';
import useGrid from '@/hooks/useGrid';

type Props = {
    company: Company;
    payPeriod: Date;
    payment: Payment;
};

export function EmployeePayments(props: Props) {
    const { payment } = props;
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    // TODO: Split into two components: data retrieval and form.
    const { data } = usePaymentPositions({ paymentId: payment.id, relations: true });
    const { getRowStatus, onAddPayment, onEditPayment, onDeletePayment } =
        useForm(rowSelectionModel);
    const { onPrint, onExport } = useGrid(gridRef);
    const columns = useColumns();

    return (
        <>
            <Toolbar
                onAdd={onAddPayment}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
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
                rows={data || []}
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
                        onEditPayment(params.row.position.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.position.id)}
            />
        </>
    );
}
