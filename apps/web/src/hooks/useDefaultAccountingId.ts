import { useGetAccountingList } from '@/hooks/queries/useAccounting';
import { AccountingType } from '@repo/openapi';
import { useMemo } from 'react';

export default function useDefaultAccountingId() {
    const { data } = useGetAccountingList();
    return useMemo(() => data?.find((o) => o.type === AccountingType.Generic)?.id, [data]);
}
