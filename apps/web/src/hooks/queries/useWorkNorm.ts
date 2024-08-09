import { api } from '@/api';
import {
    CreateWorkNormDto,
    FindWorkNormDto,
    ResourceType,
    UpdateWorkNormDto,
    WorkNorm,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetWorkNorm = (id: number, params?: FindWorkNormDto) => {
    return useQuery<WorkNorm, Error>({
        queryKey: [ResourceType.WorkNorm, { id }],
        queryFn: async () => (await api.workNormsFindOne(id, params ?? {})).data,
        enabled: !!id,
    });
};

const useGetWorkNormList = (params?: FindWorkNormDto) => {
    return useQuery<WorkNorm[], Error>({
        queryKey: [ResourceType.WorkNorm],
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
            invalidateQueries([ResourceType.WorkNorm]);
        },
    });
};

type UpdateWorkNorm = {
    id: number;
    dto: UpdateWorkNormDto;
};

const useUpdateWorkNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateWorkNorm): Promise<WorkNorm> =>
            (await api.workNormsUpdate(id, dto)).data,
        onSuccess: () => invalidateQueries([ResourceType.WorkNorm]),
    });
};

const useRemoveWorkNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.workNormsRemove(id)).data,
        onSuccess: () => invalidateQueries([ResourceType.WorkNorm]),
    });
};

export {
    useGetWorkNorm,
    useGetWorkNormList,
    useCreateWorkNorm,
    useUpdateWorkNorm,
    useRemoveWorkNorm,
};
