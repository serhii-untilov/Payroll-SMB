import { capitalizeFirstChar } from '@/utils/capitalizeFirstChar';
import { getPayPeriodName } from '@/utils/getPayPeriodName';
import { PayPeriod } from '@repo/openapi';
import { useMemo } from 'react';
import useLocale from './context/useLocale';

export default function usePayPeriodName(payPeriod: PayPeriod): string {
    const { locale } = useLocale();
    return useMemo<string>(() => {
        return capitalizeFirstChar(
            getPayPeriodName(
                payPeriod.dateFrom,
                payPeriod.dateTo,
                false,
                locale.dateLocale,
                'LLLL y',
            ),
        );
    }, [locale, payPeriod]);
}
