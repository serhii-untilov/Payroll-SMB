import useAppContext from '@/hooks/context/useAppContext';
import { companiesSalaryCalculate } from '@/services/api/company.service';
import { payPeriodsClose, payPeriodsOpen } from '@/services/api/payPeriod.service';
import * as utils from '@/utils/invalidateQueries';
import { PayPeriod, ResourceType } from '@repo/openapi';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type Params = {
    companyId: number;
    currentPayPeriod: PayPeriod | undefined;
};

export default function useCompanyPeriodList(params: Params) {
    const { companyId, currentPayPeriod } = params;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { payPeriod, setPayPeriod } = useAppContext();

    const onEdit = (_id: number) => {
        navigate('/payroll?tab-index=0&return=true');
    };

    const invalidateQueries = async () => {
        await utils.invalidateQueries(queryClient, [
            ResourceType.Position,
            ResourceType.Company,
            ResourceType.PayPeriod,
            ResourceType.Task,
        ]);
    };

    const onCalculate = async () => {
        await companiesSalaryCalculate(companyId);
        await invalidateQueries();
    };

    const onClose = async () => {
        if (currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const next = await payPeriodsClose(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(next.dateFrom);
            await invalidateQueries();
        }
    };

    const onOpen = async () => {
        if (currentPayPeriod) {
            if (currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidateQueries();
                return;
            }
            const prior = await payPeriodsOpen(currentPayPeriod.id, {
                version: currentPayPeriod.version,
            });
            setPayPeriod(prior.dateFrom);
            await invalidateQueries();
        }
    };
    return { onEdit, onCalculate, onClose, onOpen };
}
