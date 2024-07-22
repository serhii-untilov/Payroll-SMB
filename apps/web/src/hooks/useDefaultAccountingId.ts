import { Accounting, AccountingType } from '@repo/openapi';
import { useMemo } from 'react';

export function useDefaultAccountingId(accountingList: Accounting[]) {
    return useMemo(
        () => accountingList?.find((o) => o.type === AccountingType.Generic)?.id ?? 0,
        [accountingList],
    );
}
