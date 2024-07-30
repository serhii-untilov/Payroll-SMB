import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { companiesSalaryCalculate } from '@/services/api/company.service';
import { payPeriodsClose, payPeriodsOpen } from '@/services/api/payPeriod.service';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { sumFormatter } from '@/utils/sumFormatter';
import { GridColDef } from '@mui/x-data-grid';
import { ResourceType } from '@repo/openapi';
import { toDate } from '@repo/shared';
import { isEqual } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PayPeriodListProps } from './PayPeriodList';

export default function usePayPeriodList(params: PayPeriodListProps) {
    const navigate = useNavigate();
    const { payPeriod, setPayPeriod } = useAppContext();
    const { t } = useTranslation();
    const { locale } = useLocale();
    const invalidateQueries = useInvalidateQueries();

    const payPeriods = useMemo(
        () =>
            params.payPeriods
                ?.filter(
                    (o) =>
                        o.dateFrom.getTime() <=
                        (params.currentPayPeriod?.dateFrom || new Date()).getTime(),
                )
                .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime()),
        [params],
    );

    const onEdit = useCallback(
        (_id: number) => {
            navigate('/payroll?tab-index=0&return=true');
        },
        [navigate],
    );

    const invalidate = useCallback(async () => {
        await invalidateQueries([
            ResourceType.Position,
            ResourceType.Company,
            ResourceType.PayPeriod,
            ResourceType.Task,
        ]);
    }, [invalidateQueries]);

    const onCalculate = useCallback(async () => {
        await companiesSalaryCalculate(params.company.id);
        await invalidate();
    }, [params, invalidate]);

    const onClose = useCallback(async () => {
        if (params.currentPayPeriod) {
            if (params.currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidate();
                return;
            }
            const next = await payPeriodsClose(params.currentPayPeriod.id, {
                version: params.currentPayPeriod.version,
            });
            setPayPeriod(next.dateFrom);
            await invalidate();
        }
    }, [params, invalidate, setPayPeriod, payPeriod]);

    const onOpen = useCallback(async () => {
        if (params.currentPayPeriod) {
            if (params.currentPayPeriod.dateFrom.getTime() !== payPeriod?.getTime()) {
                await invalidate();
                return;
            }
            const prior = await payPeriodsOpen(params.currentPayPeriod.id, {
                version: params.currentPayPeriod.version,
            });
            setPayPeriod(prior.dateFrom);
            await invalidate();
        }
    }, [params, setPayPeriod, invalidate, payPeriod]);

    const columns = useMemo<GridColDef[]>(() => {
        return [
            {
                field: 'name',
                headerName: t('Pay Period'),
                type: 'string',
                width: 240,
                sortable: true,
                valueGetter: (params) => {
                    return getPayPeriodName(
                        toDate(params.row.dateFrom),
                        toDate(params.row.dateTo),
                        isEqual(params.row.dateFrom, payPeriod),
                        locale.dateLocale,
                    );
                },
            },
            {
                field: 'inBalance',
                headerName: t('In Balance'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return Number(params.value) === 0 ? '' : params.value;
                },
            },
            {
                field: 'accruals',
                headerName: t('Accruals'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'deductions',
                headerName: t('Deductions'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'taxes',
                headerName: t('Taxes'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'netPay',
                headerName: t('Net Pay'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    const netPay =
                        Number(params.row.inBalance) +
                        Number(params.row.accruals) -
                        (Number(params.row.deductions) - Number(params.row.payments));
                    return sumFormatter(netPay);
                },
            },
            {
                field: 'payments',
                headerName: t('Payments Sum'),
                type: 'number',
                width: 160,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
            {
                field: 'outBalance',
                headerName: t('Out Balance'),
                type: 'number',
                width: 190,
                sortable: true,
                valueGetter: (params) => {
                    return sumFormatter(params.value);
                },
            },
        ];
    }, [t, locale, payPeriod]);

    return { payPeriods, columns, onEdit, onCalculate, onClose, onOpen };
}
