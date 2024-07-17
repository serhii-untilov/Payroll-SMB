import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { sumFormatter } from '@/utils';
import {
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    paymentId: number;
};
export function MandatoryPayments(_props: Props) {
    const { t } = useTranslation();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: t('Name'),
            width: 280,
            sortable: true,
            valueGetter: (params) => {
                return params.row?.paymentType?.name;
            },
        },
        {
            field: 'incomeSum',
            headerName: t('Income Sum'),
            type: 'number',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'baseSum',
            headerName: t('Base Sum'),
            type: 'number',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'rate',
            headerName: t('Rate'),
            type: 'number',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
        {
            field: 'paySum',
            headerName: t('Payment Sum'),
            type: 'number',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return sumFormatter(params.value);
            },
        },
    ];

    // TODO
    const data = [];

    const onAddPayment = () => {
        console.log('onEditPayment');
    };

    const onEditPayment = (id: number) => {
        navigate(`/payments/${id}`);
    };

    const onDeletePayment = async () => {
        // TODO
        // for (const id of rowSelectionModel) {
        //     await paymentsRemove(+id);
        // }
        // await invalidateQueries(queryClient, );
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

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
                // rowHeight={80}
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
