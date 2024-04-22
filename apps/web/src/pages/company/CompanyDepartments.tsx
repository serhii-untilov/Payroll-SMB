import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { IDepartment, date2view } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { DataGrid } from '../../components/data/DataGrid';
import { TableToolbar } from '../../components/layout/TableToolbar';
import { Loading } from '../../components/utility/Loading';
import { deleteDepartment, getDepartmentList } from '../../services/department.service';
import { CompanyDetailsProps } from './CompanyDetails';
import DepartmentForm from './DepartmentForm';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

export function CompanyDepartments(params: CompanyDetailsProps) {
    const { companyId } = params;
    const { t } = useTranslation();
    const [openForm, setOpenForm] = useState(false);

    const [departmentId, setDepartmentId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    const gridRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: t('Department'),
            type: 'string',
            width: 400,
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
        {
            field: 'parentDepartment',
            headerName: t('Parent Department'),
            type: 'string',
            width: 250,
            sortable: true,
            valueGetter: (params) => {
                return params.row.parentDepartment?.name || '';
            },
        },
    ];

    const {
        data: departmentList,
        isError: isDepartmentListError,
        isLoading: isDepartmentListLoading,
        error: departmentListError,
    } = useQuery<IDepartment[], Error>({
        queryKey: ['departmentList-relations', companyId],
        queryFn: async () => {
            return await getDepartmentList(companyId, true);
        },
        enabled: !!companyId,
    });

    if (isDepartmentListLoading) {
        return <Loading />;
    }

    if (isDepartmentListError) {
        return enqueueSnackbar(`${departmentListError.name}\n${departmentListError.message}`, {
            variant: 'error',
        });
    }

    const onAddDepartment = () => {
        setDepartmentId(null);
        setOpenForm(true);
    };

    const onEditDepartment = (departmentId: number) => {
        setDepartmentId(departmentId);
        setOpenForm(true);
    };

    const submitCallback = (data: IDepartment) => {
        queryClient.invalidateQueries({ queryKey: ['departmentList-relations', companyId] });
    };

    const onDeleteDepartment = async () => {
        for (const id of rowSelectionModel) {
            await deleteDepartment(+id);
        }
        queryClient.invalidateQueries({ queryKey: ['departmentList-relations', companyId] });
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
                onAdd={onAddDepartment}
                onDelete={onDeleteDepartment}
                deleteDisabled={!rowSelectionModel.length}
                onPrint={onPrint}
                printDisabled={!departmentList?.length}
                onExport={onExport}
                exportDisabled={!departmentList?.length}
                onShowHistory={onShowHistory}
                showHistoryDisabled={true}
                onShowDeleted={onShowDeleted}
                showDeletedDisabled={true}
                onRestoreDeleted={onRestoreDeleted}
                restoreDeletedDisabled={true}
            />
            <DataGrid
                apiRef={gridRef}
                rows={departmentList || []}
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
                        onEditDepartment(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onEditDepartment(params.row.id)}
            />
            <DepartmentForm
                open={openForm}
                setOpen={setOpenForm}
                departmentId={departmentId}
                submitCallback={submitCallback}
            />
        </>
    );
}
