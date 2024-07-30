import { useLaws } from '@/hooks/queries/useLaws';
import { LawType } from '@repo/openapi';
import { useMemo } from 'react';

export default function useDefaultLawId() {
    const { data } = useLaws();
    return useMemo(() => data?.find((o) => o.type === LawType.Ukraine)?.id ?? 0, [data]);
}
