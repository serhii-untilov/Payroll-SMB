import { api } from '@/api';
import { Accounting, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetAccountingList = () => {
    return useQuery<Accounting[], Error>({
        queryKey: [ResourceType.Accounting],
        queryFn: async () =>
            (await api.accountingFindAll()).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            ),
    });
};

export { useGetAccountingList };
