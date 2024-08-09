import useLocale from '@/hooks/context/useLocale';
import { useCalculateCompany } from '@/hooks/queries/useCompany';
import { useClosePayPeriod, useOpenPayPeriod } from '@/hooks/queries/usePayPeriod';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { selectCompany } from '@/store/slices/companySlice';
import { setPayPeriod } from '@/store/slices/payPeriodSlice';
import { useAppDispatch, useAppSelector } from '@/store/store.hooks';
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
    const dispatch = useAppDispatch();
    const { invalidateQueries } = useInvalidateQueries();
    const calculateCompany = useCalculateCompany();
    const closePayPeriod = useClosePayPeriod();
    const openPayPeriod = useOpenPayPeriod();

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
            ResourceType.PayPeriod,
            ResourceType.Payroll,
            ResourceType.Position,
            ResourceType.Payment,
            ResourceType.PaymentPosition,
            ResourceType.Company,
            ResourceType.Task,
        ]);
    }, [invalidateQueries]);

    const onCalculate = useCallback(async () => {
        await calculateCompany.mutateAsync(params.company.id);
    }, [params, calculateCompany]);

    const onClose = useCallback(async () => {
        if (params.currentPayPeriod) {
            const next = await closePayPeriod.mutateAsync({
                id: params.currentPayPeriod.id,
                dto: {
                    version: params.currentPayPeriod.version,
                },
            });
            dispatch(setPayPeriod(next));
            await invalidate();
        }
    }, [closePayPeriod, dispatch, invalidate, params.currentPayPeriod]);

    const onOpen = useCallback(async () => {
        if (params.currentPayPeriod) {
            const prior = await openPayPeriod.mutateAsync({
                id: params.currentPayPeriod.id,
                dto: {
                    version: params.currentPayPeriod.version,
                },
            });
            setPayPeriod(prior);
            await invalidate();
        }
    }, [invalidate, openPayPeriod, params.currentPayPeriod]);

    const columns = useColumns();

    return { payPeriods, columns, onEdit, onCalculate, onClose, onOpen };
}

function useColumns() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const company = useAppSelector(selectCompany);

    return useMemo<GridColDef[]>(() => {
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
                        isEqual(params.row.dateFrom, company?.payPeriod),
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
    }, [t, company?.payPeriod, locale.dateLocale]);
}
