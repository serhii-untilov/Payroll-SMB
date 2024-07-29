import { DataGrid } from '@/components/grid/DataGrid';
import Toolbar from '@/components/layout/Toolbar';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useAppContext from '@/hooks/context/useAppContext';
import useUserCompanies from '@/hooks/queries/useUserCompanies';
import { companiesFindOne } from '@/services/api/company.service';
import { userCompaniesRemove, userCompaniesRestore } from '@/services/api/user-companies.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { snackbarError } from '@/utils/snackbar';
import {
    GridCallbackDetails,
    GridCellParams,
    GridColDef,
    GridRowParams,
    GridRowSelectionModel,
    MuiEvent,
    useGridApiRef,
} from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { date2view } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useColumns from '../hooks/useUserCompanyListColumns';

type Props = {
    userId: number;
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

    const columns = useColumns();

    const {
        data,
        isError,
        isLoading,
        error: error,
    } = useUserCompanies({ userId, relations: true, withDeleted: showDeleted });

    if (isLoading) {
        return <LoadingDisplay />;
    }

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }

    const onAddCompany = () => {
        navigate(`/profile/company/?tab-index=0&return=true`);
    };

    const onSelectCompany = async (companyId: number) => {
        setCurrentCompany(await companiesFindOne(companyId));
        navigate(`/company/${companyId}?tab-index=0&return=true`);
    };

    const onDeleteCompany = async () => {
        let attemptToDeleteCurrentCompany = false;
        for (const id of notDeletedSelection()) {
            const companyId = data?.find((o) => o.id === id)?.companyId;
            if (companyId !== currentCompany?.id) {
                await userCompaniesRemove(Number(id));
            } else {
                attemptToDeleteCurrentCompany = true;
            }
        }
        setRowSelectionModel([]);
        await invalidateQueries(queryClient, [ResourceType.Company]);
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
            await userCompaniesRestore(id);
        }
        setRowSelectionModel([]);
        await invalidateQueries(queryClient, [ResourceType.Company]);
    };

    const onPrint = () => {
        gridRef.current.exportDataAsPrint();
    };

    const onExport = () => {
        gridRef.current.exportDataAsCsv();
    };

    const onShowDeleted = async () => {
        setShowDeleted(!showDeleted);
        await invalidateQueries(queryClient, [ResourceType.Company]);
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
