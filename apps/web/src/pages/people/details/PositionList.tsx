import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { IFindPosition, IPosition, date2view, maxDate } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import { deletePosition, getPositions } from '../../../services/position.service';
import useAppContext from '../../../hooks/useAppContext';

export function PositionList(props: IFindPosition) {
    const { companyId } = props;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const gridRef = useGridApiRef();
    const navigate = useNavigate();
    const { payPeriod } = useAppContext();

    const columns: GridColDef[] = [
        {
            field: 'cardNumber',
            headerName: t('Card Number'),
            type: 'string',
            width: 100,
            sortable: true,
        },
        {
            field: 'name',
            headerName: t('Position'),
            type: 'string',
            width: 250,
            // Warning: Failed prop type: MUI: `column.resizable = true` is not a valid prop.
            // Column resizing is not available in the MIT version.
            // resizable: true,
            sortable: true,
            valueGetter: (params) => {
                return params.row?.personId ? params.row?.person?.fullName || '' : t('Vacancy');
            },
        },
        {
            field: 'job',
            headerName: t('Job'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.job?.name || ''
                    : '';
            },
        },
        {
            field: 'department',
            headerName: t('Department'),
            type: 'string',
            width: 300,
            sortable: true,
            valueGetter: (params) => {
                return payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.department?.name || ''
                    : '';
            },
        },
        {
            field: 'workNorm',
            headerName: t('Work Norm'),
            type: 'string',
            width: 250,
            sortable: true,
            valueGetter: (params) => {
                return payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.workNorm?.name || ''
                    : '';
            },
        },
        {
            field: 'paymentType',
            headerName: t('Payment Form'),
            type: 'string',
            width: 190,
            sortable: true,
            valueGetter: (params) => {
                return payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.paymentType?.name || ''
                    : '';
            },
        },
        {
            field: 'wage',
            headerName: t('Wage'),
            type: 'number',
            width: 110,
            sortable: true,
            valueGetter: (params) => {
                const wage = payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.wage || ''
                    : '';
                return Number(wage) === 0 ? '' : wage;
            },
        },
        {
            field: 'rate',
            headerName: t('Rate'),
            type: 'number',
            width: 80,
            sortable: true,
            valueGetter: (params) => {
                return payPeriod
                    ? params.row?.history?.find(
                          (o) => o.dateFrom <= payPeriod && o.dateTo >= payPeriod,
                      )?.rate || ''
                    : '';
            },
        },
        {
            field: 'dateFrom',
            headerName: t('Date From'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.value);
            },
        },
        {
            field: 'dateTo',
            headerName: t('Date To'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.value);
            },
        },
    ];

    const { data, isError, isLoading, error } = useQuery<IPosition[], Error>({
        queryKey: ['position', 'list', props],
        queryFn: async () => {
            return (await getPositions(props)).sort((a, b) =>
                (Number(a.cardNumber) || 2147483647) < (Number(b.cardNumber) || 2147483647)
                    ? -1
                    : (Number(a.cardNumber) || 2147483647) > (Number(b.cardNumber) || 2147483647)
                      ? 1
                      : 0,
            );
        },
        enabled: !!companyId && !!payPeriod,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onAddPosition = () => {
        navigate('/people/position/?tab=details&return=true');
    };

    const onEditPosition = (positionId: number) => {
        navigate(`/people/position/${positionId}?return=true`);
    };

    const submitCallback = async (data: IPosition) => {
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await deletePosition(+id);
        }
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onShowHistory = () => {
        console.log('onShowHistory');
    };

    const onShowDeleted = () => {
        console.log('onShowDeleted');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.dateTo < maxDate()
              ? 'Dismissed'
              : !params.row?.personId
                ? 'Vacancy'
                : 'Normal';
    };

    return (
        <>
            <Toolbar
                onAdd={onAddPosition}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onDelete={rowSelectionModel.length ? onDeletePosition : 'disabled'}
                // onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
                onShowHistory={'disabled'}
            />
            <DataGrid
                getRowStatus={getRowStatus}
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                }}
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
                    details: GridCallbackDetails,
                ) => {
                    if (event.code === 'Enter') {
                        onEditPosition(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEditPosition(params.row.id)}
            />
        </>
    );
}
