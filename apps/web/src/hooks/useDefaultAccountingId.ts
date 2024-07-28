import { useAccountingList } from '@/hooks/queries/useAccounting';
import { AccountingType } from '@repo/openapi';
import { useMemo } from 'react';

export default function useDefaultAccountingId() {
    const { data } = useAccountingList();
    return useMemo(() => data?.find((o) => o.type === AccountingType.Generic)?.id ?? 0, [data]);
}
