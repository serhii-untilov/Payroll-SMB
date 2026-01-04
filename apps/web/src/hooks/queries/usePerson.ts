import { api } from '@/api';
import { CreatePersonDto, Person, Resource, UpdatePersonDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPerson = (id: string) => {
    return useQuery<Person, Error>({
        queryKey: [Resource.Person, { id }],
        queryFn: async () => (await api.personsFindOne(id)).data,
        enabled: !!id,
    });
};

const useGetPersonList = () => {
    return useQuery<Person[], Error>({
        queryKey: [Resource.Person],
        queryFn: async () => {
            return (await api.personsFindAll()).data.sort((a, b) =>
                a.fullName.toUpperCase().localeCompare(b.fullName.toUpperCase()),
            );
        },
    });
};

const useCreatePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePersonDto): Promise<Person> => (await api.personsCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Person, Resource.Task]);
        },
    });
};

type UpdatePerson = {
    id: string;
    dto: UpdatePersonDto;
};

const useUpdatePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, dto }: UpdatePerson): Promise<Person> => (await api.personsUpdate(id, dto)).data,
        onSuccess: () => invalidateQueries([Resource.Person, Resource.Task]),
    });
};

const useRemovePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (id: string) => (await api.personsRemove(id)).data,
        onSuccess: () => invalidateQueries([Resource.Person, Resource.Task]),
    });
};

export { useGetPerson, useGetPersonList, useCreatePerson, useUpdatePerson, useRemovePerson };
