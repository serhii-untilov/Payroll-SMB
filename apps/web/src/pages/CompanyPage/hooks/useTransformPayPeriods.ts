import { PayPeriod } from '@repo/openapi';
import { useMemo } from 'react';

type Params = {
    data: PayPeriod[] | undefined;
    payPeriod: Date | undefined;
};

export default function useTransformPayPeriods(params: Params) {
    return useMemo(() => {
        return params.data
            ?.filter((o) => o.dateFrom.getTime() <= (params.payPeriod || new Date()).getTime())
            .sort((a, b) => b.dateFrom.getTime() - a.dateFrom.getTime());
    }, [params]);
}
