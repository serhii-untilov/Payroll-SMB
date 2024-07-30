import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, Payment } from '@repo/openapi';
import { useState } from 'react';
import useForm from '../hooks/useMandatoryPayments';
import useColumns from '../hooks/useMandatoryPaymentsColumns';
import useGrid from '@/hooks/useGrid';

type Props = {
    company: Company;
    payPeriod: Date;
    payment: Payment;
};
export function MandatoryPayments(_props: Props) {
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const { onAddPayment, onDeletePayment, onEditPayment } = useForm();
    const { onPrint, onExport } = useGrid(gridRef);
    const columns = useColumns();

    // TODO: Split into two components: data retrieval and form.
    const data = [];

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
                        onEditPayment(params.row.id);
                    }
                }}
                onRowDoubleClick={(params: GridRowParams) => onEditPayment(params.row.id)}
            />
        </>
    );
}
