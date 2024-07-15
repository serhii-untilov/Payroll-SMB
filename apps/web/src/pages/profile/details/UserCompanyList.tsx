import { api, dto } from '@/api';
import { DataGrid } from '@/components/grid/DataGrid';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import useAppContext from '@/hooks/useAppContext';
import { deleteUserCompany, getUserCompanyList, restoreUserCompany } from '@/services/user.service';
import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { date2view } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    userId: number | undefined;
};

export function UserCompanyList(params: Props) {
    const { userId } = params;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const gridRef = useGridApiRef();

    const columns: GridColDef[] = [
        {
            field: 'companyName',
            headerName: t('Company'),
            type: 'string',
            width: 400,
            sortable: true,
            valueGetter: (params) => {
                return params.row.company?.name;
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
                return date2view(params.row.company?.payPeriod);
            },
        },
        {
            field: 'dateFrom',
            headerName: t('Date From'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.row.company?.dateFrom);
            },
        },

        {
            field: 'dateTo',
            headerName: t('Date To'),
            type: 'string',
            width: 200,
            sortable: true,
            valueGetter: (params) => {
                return date2view(params.row.company?.dateTo);
            },
        },
    ];

    const {
        data,
        isError,
        isLoading,
        error: error,
    } = useQuery<dto.UserCompany[], Error>({
        queryKey: ['company', 'list', { userId, showDeleted }],
        queryFn: async () => {
            return userId ? await getUserCompanyList(userId, true, showDeleted) : [];
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
        navigate(`/profile/company/?tab=details&return=true`);
    };

    const onSelectCompany = async (companyId: number) => {
        console.log('onEditCompany');
        const company = (await api.companiesFindOne(companyId)).data;
        setCurrentCompany(company);
        navigate(`/company/${companyId}?tab=details&return=true`);
    };

    const onDeleteCompany = async () => {
        let attemptToDeleteCurrentCompany = false;
        for (const id of notDeletedSelection()) {
            const companyId = data?.find((o) => o.id === id)?.companyId;
            if (companyId !== currentCompany?.id) {
                await deleteUserCompany(Number(id));
            } else {
                attemptToDeleteCurrentCompany = true;
            }
        }
        setRowSelectionModel([]);
        await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
        if (attemptToDeleteCurrentCompany) {
            enqueueSnackbar(t(`Deleting the current company is not allowed.`), {
                variant: 'error',
            });
        }
    };

    const deletedSelection = (): number[] => {
        return rowSelectionModel
            .filter((id) =>
                data?.find(
                    (userCompany) => userCompany.id === Number(id) && userCompany.deletedDate,
                ),
            )
            .map((o) => Number(o));
    };

    const notDeletedSelection = (): number[] => {
        return rowSelectionModel
            .filter((id) =>
                data?.find(
                    (userCompany) =>
                        userCompany.id === Number(id) && userCompany.deletedDate === null,
                ),
            )
            .map((o) => Number(o));
    };

    const onRestoreDeleted = async () => {
        for (const id of deletedSelection()) {
            await restoreUserCompany(id);
        }
        setRowSelectionModel([]);
        await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onShowDeleted = async () => {
        setShowDeleted(!showDeleted);
        await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.companyId === currentCompany?.id
              ? 'Current'
              : 'Normal';
    };

    return (
        <>
            <Toolbar
                onAdd={onAddCompany}
                onDelete={notDeletedSelection().length ? onDeleteCompany : 'disabled'}
                onPrint={data?.length ? onPrint : 'disabled'}
                onExport={data?.length ? onExport : 'disabled'}
                onShowHistory={'disabled'}
                onShowDeleted={onShowDeleted}
                onRestoreDeleted={
                    showDeleted && deletedSelection().length ? onRestoreDeleted : 'disabled'
                }
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
                        onSelectCompany(params.row.id);
                    }
                }}
                onRowDoubleClick={(
                    params: GridRowParams,
                    _event: MuiEvent,
                    _details: GridCallbackDetails,
                ) => onSelectCompany(params.row.id)}
            />
        </>
    );
}
