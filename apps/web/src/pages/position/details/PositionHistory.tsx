import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import { usePositionHistoryList } from '@/hooks/usePositionHistoryList';
import {
    GridCallbackDetails,
    GridCellParams,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    positionId: number;
};

export function PositionHistory(props: Props) {
    const { positionId } = props;
    const { data, isLoading } = usePositionHistoryList({ positionId, relations: true });
    const columns = useColumns();
    const gridRef = useGridApiRef();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    if (isLoading) return <Loading />;

    // TODO
    const onAdd = () => console.log('onAdd');
    const onEdit = (_id: number) => console.log('onEdit');
    const onDelete = async () => console.log('onDelete');

    const onPrint = () => gridRef.current.exportDataAsPrint();
    const onExport = () => gridRef.current.exportDataAsCsv();
    const getRowStatus = (_params: any) => 'Normal';

    return (
        <>
            <Toolbar
                onAdd={onAdd}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDelete : 'disabled'}
            />
            <DataGrid
                getRowStatus={getRowStatus}
                apiRef={gridRef}
                rows={data || []}
                columns={columns}
                checkboxSelection={true}
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                onCellKeyDown={(
                    params: GridCellParams,
                    event: MuiEvent<React.KeyboardEvent<HTMLElement>>,
                    _details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onEdit(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    _event: MuiEvent,
                    _details: GridCallbackDetails,
                ) => onEdit(params.row.id)}
            />
        </>
    );
}

function useColumns() {
    const { t } = useTranslation();
    return useMemo(
        () => [
            {
                field: 'dateFrom',
                headerName: t('Date From'),
                type: 'string',
                width: 200,
                sortable: true,
            },
            {
                field: 'dateTo',
                headerName: t('Date To'),
                type: 'string',
                width: 200,
                sortable: true,
            },

            {
                field: 'job',
                headerName: t('Job'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params: any) => params?.row?.job?.name || '',
            },
            {
                field: 'department',
                headerName: t('Department'),
                type: 'string',
                width: 300,
                sortable: true,
                valueGetter: (params: any) => params?.row?.department?.name || '',
            },
            {
                field: 'workNorm',
                headerName: t('Work Norm'),
                type: 'string',
                width: 250,
                sortable: true,
                valueGetter: (params: any) => params?.row?.workNorm?.name || '',
            },
            {
                field: 'paymentType',
                headerName: t('Payment Form'),
                type: 'string',
                width: 200,
                sortable: true,
                valueGetter: (params: any) => params?.row?.paymentType?.name || '',
            },
            {
                field: 'wage',
                headerName: t('Wage'),
                type: 'number',
                width: 130,
                sortable: true,
            },
            {
                field: 'rate',
                headerName: t('Rate'),
                type: 'number',
                width: 130,
                sortable: true,
            },
        ],
        [t],
    );
}
