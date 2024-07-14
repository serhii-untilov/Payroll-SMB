import { api } from '@/api';
import { snackbarError } from '@/utils/snackbar';
import { Company } from '@repo/openapi';
import { ResourceType } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

type Result = { data: Company | undefined | null; isLoading: boolean };

export function useCompany(companyId: number | undefined): Result {
    const [id] = useState(Number(companyId));
    const { data, isError, isLoading, error } = useQuery<Company | null, Error>({
        queryKey: [ResourceType.COMPANY, { id }],
        queryFn: async () => {
            return id ? (await api.companiesFindOne(id)).data ?? null : null;
        },
    });
    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }
    return { data, isLoading };
}
