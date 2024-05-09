import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { ICompany, IUserCompany, date2view } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '../../../components/grid/DataGrid';
import { Toolbar } from '../../../components/layout/Toolbar';
import { Loading } from '../../../components/utility/Loading';
import { deleteCompany, getCompany, getCompanyList } from '../../../services/company.service';
import Company from '../../company/Company';
import { getUserCompanyList } from '../../../services/user.service';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../../../hooks/useAppContext';

type Props = {
    userId: number | undefined;
};

export function UserCompanyList(params: Props) {
    const { userId } = params;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { setCompany } = useAppContext();

    const gridRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            field: 'companyName',
            headerName: t('Company'),
            type: 'string',
            width: 400,
            sortable: true,
            valueGetter: (params) => {
                return params.row.company.name;
            },
        },
        {
            field: 'roleName',
            headerName: t('User Role'),
            type: 'string',
            width: 400,
            sortable: true,
            valueGetter: (params) => {
                return params.row.role.name;
            },
        },
        {
            field: 'payPeriod',
            headerName: t('Pay Period'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.row.company.payPeriod);
            },
        },
        {
            field: 'dateFrom',
            headerName: t('Date From'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.row.company.dateFrom);
            },
        },

        {
            field: 'dateTo',
            headerName: t('Date To'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.row.company.dateTo);
            },
        },
    ];

    const {
        data,
        isError,
        isLoading,
        error: error,
    } = useQuery<IUserCompany[], Error>({
        queryKey: ['userCompany', 'list', { userId }],
        queryFn: async () => {
            return userId ? await getUserCompanyList(userId, true) : [];
        },
        enabled: !!userId,
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    const onAddCompany = () => {
        console.log('onAddCompany');
        navigate(`/profile/company/`);
    };

    const onSelectCompany = async (companyId: number) => {
        console.log('onEditCompany');
        const company = await getCompany(companyId);
        setCompany(company);
        navigate(`/company/${companyId}`);
    };

    const submitCallback = (data: ICompany) => {
        queryClient.invalidateQueries({ queryKey: ['userCompany'], refetchType: 'all' });
    };

    const onDeleteCompany = async () => {
        // for (const id of rowSelectionModel) {
        //     await deleteCompany(+id);
        // }
        // queryClient.invalidateQueries({ queryKey: ['userCompany'], refetchType: 'all' });
        console.log('onDeleteCompany');
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
                onAdd={onAddCompany}
                onDelete={rowSelectionModel.length ? onDeleteCompany : 'disabled'}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={'disabled'}
                onRestoreDeleted={'disabled'}
            />
            <DataGrid
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
                        onSelectCompany(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    event: MuiEvent,
                    details: GridCallbackDetails,
                ) => onSelectCompany(params.row.id)}
            />
        </>
    );
}
