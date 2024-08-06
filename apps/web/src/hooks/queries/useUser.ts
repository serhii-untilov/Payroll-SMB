import { api } from '@/api';
import { CreateUserDto, PublicUserDataDto, ResourceType, UpdateUserDto, User } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetUserList = (relations?: boolean) => {
    return useQuery<User[], Error>({
        queryKey: [ResourceType.User, { relations }],
        queryFn: async () =>
            (await api.usersFindAll(!!relations)).data.sort((a, b) =>
                a.email.toUpperCase().localeCompare(b.email.toUpperCase()),
            ),
    });
};

const useGetUser = (userId: number, relations?: boolean) => {
    return useQuery<User, Error>({
        queryKey: [ResourceType.User, { userId, relations }],
        queryFn: async () => (await api.usersFindOne(userId, !!relations)).data,
        enabled: !!userId,
    });
};

const useGetCurrentUser = () => {
    return useQuery<User, Error>({
        queryKey: [ResourceType.User, 'current', { relations: true }],
        queryFn: async () => (await api.usersFindCurrent({ relations: true })).data,
    });
};

const useCreateUser = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateUserDto): Promise<PublicUserDataDto> =>
            (await api.usersCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.User]);
        },
    });
};

type UpdateUser = {
    id: number;
    dto: UpdateUserDto;
};

const useUpdateUser = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateUser): Promise<User> =>
            (await api.usersUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.User]);
        },
    });
};

const useRemoveUser = () => {
    const invalidateQueries = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: number) => (await api.usersRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([ResourceType.User]);
        },
    });
};

export {
    useCreateUser,
    useGetCurrentUser,
    useGetUser,
    useGetUserList,
    useRemoveUser,
    useUpdateUser,
};
