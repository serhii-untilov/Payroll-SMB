import { dto } from '@/api';
import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import { positionHistoryFindAll } from '@/services/positionHistory.service';
import { invalidateQueries } from '@/utils';
import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { ResourceType } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    positionId: number;
};

export function PositionHistory(props: Props) {
    const { positionId } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const gridRef = useGridApiRef();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef[] = [
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
    ];

    const { data, isError, isLoading, error } = useQuery<dto.PositionHistory[], Error>({
        queryKey: [ResourceType.POSITION_HISTORY, props],
        queryFn: async () => {
            return positionId ? await positionHistoryFindAll({ positionId, relations: true }) : [];
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onAdd = () => {
        console.log('onAdd');
    };

    const onEdit = (_id: number) => {
        console.log('onEdit');
    };

    const onDelete = async () => {
        console.log('onDelete');
        // delete
        await invalidateQueries(queryClient, [ResourceType.POSITION_HISTORY]);
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const getRowStatus = (_params: any): string => {
        return 'Normal';
    };

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
