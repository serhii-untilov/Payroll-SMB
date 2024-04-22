import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { IPosition, date2view } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { DataGrid } from '../../components/data/DataGrid';
import { TableToolbar } from '../../components/layout/TableToolbar';
import { Loading } from '../../components/utility/Loading';
import { deletePosition, getPositionList } from '../../services/position.service';
// import { CompanyDetailsProps } from './CompanyDetails';
import { PositionForm } from './PositionForm';

type PeopleEmployeesProps = {
    companyId: number;
};

export function PeopleEmployees(params: PeopleEmployeesProps) {
    const { companyId } = params;
    const { t } = useTranslation();
    const [openForm, setOpenForm] = useState(false);

    const [positionId, setPositionId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const gridRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            field: 'cardNumber',
            headerName: t('Card Number'),
            type: 'string',
            width: 120,
            sortable: true,
        },
        {
            field: 'name',
            headerName: t('Position'),
            type: 'string',
            width: 300,
            sortable: true,
        },
        {
            field: 'job',
            headerName: t('Job'),
            type: 'string',
            width: 200,
            sortable: true,
        },
        {
            field: 'department',
            headerName: t('Department'),
            type: 'string',
            width: 300,
            sortable: true,
        },
        {
            field: 'workNorm',
            headerName: t('Work Norm'),
            type: 'string',
            width: 200,
            sortable: true,
        },
        {
            field: 'paymentType',
            headerName: t('Payment Type'),
            type: 'string',
            width: 200,
            sortable: true,
        },
        {
            field: 'wage',
            headerName: t('Wage'),
            type: 'number',
            width: 150,
            sortable: true,
        },
        {
            field: 'rate',
            headerName: t('Rate'),
            type: 'number',
            width: 150,
            sortable: true,
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

    const {
        data: positionList,
        isError: isPositionListError,
        isLoading: isPositionListLoading,
        error: positionListError,
    } = useQuery<IPosition[], Error>({
        queryKey: ['positionList-relations', companyId],
        queryFn: async () => {
            return await getPositionList(companyId, true);
        },
        enabled: !!companyId,
    });

    if (isPositionListLoading) {
        return <Loading />;
    }

    if (isPositionListError) {
        return enqueueSnackbar(`${positionListError.name}\n${positionListError.message}`, {
            variant: 'error',
        });
    }

    const onAddPosition = () => {
        setPositionId(null);
        setOpenForm(true);
    };

    const onEditPosition = (positionId: number) => {
        setPositionId(positionId);
        setOpenForm(true);
    };

    const submitCallback = (data: IPosition) => {
        queryClient.invalidateQueries({ queryKey: ['positionList-relations', companyId] });
    };

    const onDeletePosition = async () => {
        for (const id of rowSelectionModel) {
            await deletePosition(+id);
        }
        queryClient.invalidateQueries({ queryKey: ['positionList-relations', companyId] });
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

    return (
        <>
            <TableToolbar
                onAdd={onAddPosition}
                onDelete={onDeletePosition}
                deleteDisabled={!rowSelectionModel.length}
                onPrint={onPrint}
                printDisabled={!positionList?.length}
                onExport={onExport}
                exportDisabled={!positionList?.length}
                onShowHistory={onShowHistory}
                showHistoryDisabled={true}
                onShowDeleted={onShowDeleted}
                showDeletedDisabled={true}
                onRestoreDeleted={onRestoreDeleted}
                restoreDeletedDisabled={true}
            />
            <DataGrid
                columnVisibilityModel={{
                    // Hide columns, the other columns will remain visible
                    department: false,
                    dateFrom: false,
                    dateTo: false,
                }}
                apiRef={gridRef}
                rows={positionList || []}
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
            <PositionForm
                open={openForm}
                setOpen={setOpenForm}
                positionId={positionId}
                submitCallback={submitCallback}
            />
        </>
    );
}
