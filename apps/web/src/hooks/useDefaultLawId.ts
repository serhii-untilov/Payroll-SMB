import { useGetLawList } from '@/hooks/queries/useLaw';
import { LawType } from '@repo/openapi';
import { useMemo } from 'react';

export default function useDefaultLawId() {
    const { data } = useGetLawList();
    return useMemo(() => data?.find((o) => o.type === LawType.Ukraine)?.id, [data]);
}
