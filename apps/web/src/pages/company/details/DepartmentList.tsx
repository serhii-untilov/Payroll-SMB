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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import { deleteDepartment, getDepartmentList } from '../../../services/department.service';
import DepartmentForm from '../../department/DepartmentForm';

type Props = {
    companyId: number | undefined;
};

export function DepartmentList(params: Props) {
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
        queryKey: ['department', 'list', { companyId, relations: true }],
        queryFn: async () => {
            return companyId ? await getDepartmentList(companyId, true) : [];
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
        queryClient.invalidateQueries({ queryKey: ['department'] });
    };

    const onDeleteDepartment = async () => {
        for (const id of rowSelectionModel) {
            await deleteDepartment(+id);
        }
        queryClient.invalidateQueries({ queryKey: ['department'] });
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
                onAdd={onAddDepartment}
                onDelete={rowSelectionModel.length ? onDeleteDepartment : 'disabled'}
                onPrint={departmentList?.length ? onPrint : 'disabled'}
                onExport={departmentList?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
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
