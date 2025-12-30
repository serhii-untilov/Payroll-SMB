import { api } from '@/api';
import { Accounting, Resource } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

const useGetAccountingList = () => {
    return useQuery<Accounting[], Error>({
        queryKey: [Resource.Accounting],
        queryFn: async () =>
            (await api.accountingFindAll()).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            ),
    });
};

export { useGetAccountingList };
