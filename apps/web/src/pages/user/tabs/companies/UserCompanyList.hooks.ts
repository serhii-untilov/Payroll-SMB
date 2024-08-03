import { api } from '@/api';
import useAppContext from '@/hooks/context/useAppContext';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { userCompaniesRemove, userCompaniesRestore } from '@/services/user-companies.service';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { ResourceType, UserCompany } from '@repo/openapi';
import { date2view } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Params {
    userCompanies: UserCompany[];
    rowSelectionModel: GridRowSelectionModel;
    setRowSelectionModel: any;
    gridRef: any;
    showDeleted: boolean;
    setShowDeleted: (showDeleted: boolean) => void;
}

const useUserCompanyList = (params: Params) => {
    const { userCompanies, rowSelectionModel, setRowSelectionModel, showDeleted, setShowDeleted } =
        params;
    const { t } = useTranslation();
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const navigate = useNavigate();
    const invalidateQueries = useInvalidateQueries();

    const onAddCompany = () => {
        navigate(`/profile/company/?tab-index=0&return=true`);
    };

    const onSelectCompany = async (companyId: number) => {
        setCurrentCompany((await api.companiesFindOne(companyId)).data);
        navigate(`/company/${companyId}?tab-index=0&return=true`);
    };

    const onDeleteCompany = async () => {
        let attemptToDeleteCurrentCompany = false;
        for (const id of notDeletedSelection()) {
            const companyId = userCompanies?.find((o) => o.id === id)?.companyId;
            if (companyId !== currentCompany?.id) {
                await userCompaniesRemove(Number(id));
            } else {
                attemptToDeleteCurrentCompany = true;
            }
        }
        setRowSelectionModel([]);
        await invalidateQueries([ResourceType.Company]);
        if (attemptToDeleteCurrentCompany) {
            enqueueSnackbar(t(`Deleting the current company is not allowed.`), {
                variant: 'error',
            });
        }
    };

    const deletedSelection = (): number[] => {
        return rowSelectionModel
            .filter((id) =>
                userCompanies?.find(
                    (userCompany) => userCompany.id === Number(id) && userCompany.deletedDate,
                ),
            )
            .map((o) => Number(o));
    };

    const notDeletedSelection = (): number[] => {
        return rowSelectionModel
            .filter((id) =>
                userCompanies?.find(
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
        await invalidateQueries([ResourceType.Company]);
    };

    const onShowDeleted = async () => {
        setShowDeleted(!showDeleted);
        await invalidateQueries([ResourceType.Company]);
    };

    const getRowStatus = (params: any): string => {
        return params.row?.deletedDate
            ? 'Deleted'
            : params.row?.companyId === currentCompany?.id
              ? 'Current'
              : 'Normal';
    };

    const columns = useMemo<GridColDef[]>(
        () => [
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
        ],
        [t],
    );
    return {
        columns,
        onAddCompany,
        onSelectCompany,
        onDeleteCompany,
        deletedSelection,
        notDeletedSelection,
        onRestoreDeleted,
        onShowDeleted,
        getRowStatus,
    };
};

export default useUserCompanyList;
