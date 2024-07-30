import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import useLocale from '@/hooks/context/useLocale';
import useGrid from '@/hooks/useGrid';
import {
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { Company, PayPeriod } from '@repo/openapi';
import { monthBegin } from '@repo/shared';
import { useState } from 'react';
import useForm from '../../hooks/useCompanyPeriodList';
import useColumns from '../../hooks/useCompanyPeriodsColumns';
import useTransformPayPeriods from '../../hooks/useTransformPayPeriods';

type Props = {
    company: Company;
    payPeriods: PayPeriod[];
    currentPayPeriod: PayPeriod | undefined;
};

export function CompanyPeriodList(props: Props) {
    const { company, currentPayPeriod } = props;
    const companyId = company.id;
    const { locale } = useLocale();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const data = useTransformPayPeriods({ data: props.payPeriods, payPeriod: company.payPeriod });
    const columns = useColumns(locale.dateLocale, company.payPeriod ?? monthBegin(new Date()));
    const { onEdit, onCalculate, onClose, onOpen } = useForm({ companyId, currentPayPeriod });
    const { onPrint, onExport } = useGrid(gridRef);

    return (
        <>
            <Toolbar
                onCalculate={onCalculate}
                onClose={onClose}
                onOpen={onOpen}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
            />
            <DataGrid
                apiRef={gridRef}
                rows={data || []}
                columns={columns}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    taxes: false,
                }}
                checkboxSelection={false}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
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
