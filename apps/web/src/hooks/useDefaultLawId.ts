import { Law, LawType } from '@repo/openapi';
import { useMemo } from 'react';

export function useDefaultLawId(lawList: Law[]) {
    return useMemo(() => lawList?.find((o) => o.type === LawType.Ukraine)?.id ?? 0, [lawList]);
}
