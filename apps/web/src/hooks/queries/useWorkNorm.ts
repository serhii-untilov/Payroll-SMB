import { api } from '@/api';
import {
    CreateWorkNormDto,
    FindWorkNormDto,
    Resource,
    UpdateWorkNormDto,
    WorkNorm,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetWorkNorm = (id: string, params?: FindWorkNormDto) => {
    return useQuery<WorkNorm, Error>({
        queryKey: [Resource.WorkNorm, { id }],
        queryFn: async () => (await api.workNormsFindOne(id, params ?? {})).data,
        enabled: !!id,
    });
};

const useGetWorkNormList = (params?: FindWorkNormDto) => {
    return useQuery<WorkNorm[], Error>({
        queryKey: [Resource.WorkNorm],
        queryFn: async () => {
            return (await api.workNormsFindAll(params ?? {})).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
};

const useCreateWorkNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateWorkNormDto): Promise<WorkNorm> =>
            (await api.workNormsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.WorkNorm]);
        },
    });
};

type UpdateWorkNorm = {
    id: string;
    dto: UpdateWorkNormDto;
};

const useUpdateWorkNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateWorkNorm): Promise<WorkNorm> =>
            (await api.workNormsUpdate(id, dto)).data,
        onSuccess: () => invalidateQueries([Resource.WorkNorm]),
    });
};

const useRemoveWorkNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.workNormsRemove(id)).data,
        onSuccess: () => invalidateQueries([Resource.WorkNorm]),
    });
};

export {
    useGetWorkNorm,
    useGetWorkNormList,
    useCreateWorkNorm,
    useUpdateWorkNorm,
    useRemoveWorkNorm,
};
