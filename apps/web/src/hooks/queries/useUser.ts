import { api } from '@/api';
import { CreateUserDto, PublicUserDataDto, Resource, UpdateUserDto, User } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetUserList = (relations?: boolean) => {
    return useQuery<User[], Error>({
        queryKey: [Resource.User, { relations }],
        queryFn: async () =>
            (await api.userFindAll()).data.sort((a: User, b: User) =>
                a.email.toUpperCase().localeCompare(b.email.toUpperCase()),
            ),
    });
};

const useGetUser = (userId: string, relations?: boolean) => {
    return useQuery<User, Error>({
        queryKey: [Resource.User, { userId, relations }],
        queryFn: async () => (await api.userFindOne(userId)).data,
        enabled: !!userId,
    });
};

const useGetCurrentUser = () => {
    return useQuery<User, Error>({
        queryKey: [Resource.User, 'current', { relations: true }],
        queryFn: async () => (await api.userFindCurrent()).data,
    });
};

const useCreateUser = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreateUserDto): Promise<PublicUserDataDto> => (await api.userCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.User]);
        },
    });
};

type UpdateUser = {
    id: string;
    dto: UpdateUserDto;
};

const useUpdateUser = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdateUser): Promise<User> => (await api.userUpdate(id, dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.User]);
        },
    });
};

const useRemoveUser = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.userRemove(id)).data,
        onSuccess: () => {
            invalidateQueries([Resource.User]);
        },
    });
};

export { useCreateUser, useGetCurrentUser, useGetUser, useGetUserList, useRemoveUser, useUpdateUser };
