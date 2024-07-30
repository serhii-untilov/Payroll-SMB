import useAppContext from '@/hooks/context/useAppContext';
import { companiesFindOne } from '@/services/api/company.service';
import { userCompaniesRemove, userCompaniesRestore } from '@/services/api/user-companies.service';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { ResourceType, UserCompany } from '@repo/openapi';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
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

export default function useUserCompanyList(params: Params) {
    const { userCompanies, rowSelectionModel, setRowSelectionModel, showDeleted, setShowDeleted } =
        params;
    const { t } = useTranslation();
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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
            const companyId = userCompanies?.find((o) => o.id === id)?.companyId;
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
        await invalidateQueries(queryClient, [ResourceType.Company]);
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
    return {
        onAddCompany,
        onSelectCompany,
        onDeleteCompany,
        deletedSelection,
        notDeletedSelection,
        onRestoreDeleted,
        onShowDeleted,
        getRowStatus,
    };
}
