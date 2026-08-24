import { api } from '@/api';
import {
    CreateWorkTimeNormDto,
    FindWorkTimeNormDto,
    Resource,
    UpdateWorkTimeNormDto,
    WorkTimeNorm,
} from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetWorkTimeNorm = (id: string, params?: FindWorkTimeNormDto) => {
    return useQuery<WorkTimeNorm, Error>({
        queryKey: [Resource.WorkTimeNorm, { id }],
        queryFn: async () => (await api.workTimeNormFindOne(id, params ?? {})).data,
        enabled: !!id,
    });
};

const useGetWorkTimeNormList = (params?: FindWorkTimeNormDto) => {
    return useQuery<WorkTimeNorm[], Error>({
        queryKey: [Resource.WorkTimeNorm],
        queryFn: async () => {
            return (await api.workTimeNormFindAll(params ?? {})).data.sort((a, b) =>
                a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
            );
        },
    });
};

const useCreateWorkTimeNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateWorkTimeNormDto): Promise<WorkTimeNorm> =>
            (await api.workTimeNormCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.WorkTimeNorm]);
        },
    });
};

type UpdateWorkTimeNorm = {
    id: string;
    version: number;
    dto: UpdateWorkTimeNormDto;
};

type RemoveWorkTimeNorm = {
    id: string;
    version: number;
};

const useUpdateWorkTimeNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdateWorkTimeNorm): Promise<WorkTimeNorm> =>
            (await api.workTimeNormUpdate(id, version, dto)).data,
        onSuccess: () => invalidateQueries([Resource.WorkTimeNorm]),
    });
};

const useRemoveWorkTimeNorm = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemoveWorkTimeNorm) => (await api.workTimeNormRemove(id, version)).data,
        onSuccess: () => invalidateQueries([Resource.WorkTimeNorm]),
    });
};

export {
    useGetWorkTimeNorm,
    useGetWorkTimeNormList,
    useCreateWorkTimeNorm,
    useUpdateWorkTimeNorm,
    useRemoveWorkTimeNorm,
};
