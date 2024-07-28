import { PayPeriod } from '@repo/openapi';
import useLocale from './useLocale';
import { useMemo } from 'react';
import { capitalizeFirstChar } from '@/utils/capitalizeFirstChar';
import { getPayPeriodName } from '@/utils/getPayPeriodName';

const usePayPeriodName = (payPeriod: PayPeriod): string => {
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
};

export default usePayPeriodName;
