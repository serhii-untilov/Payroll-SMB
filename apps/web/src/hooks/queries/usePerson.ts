import { api } from '@/api';
import { CreatePersonDto, IdDto, PersonListItemDto, PersonReadDto, Resource, UpdatePersonDto } from '@repo/openapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import useInvalidateQueries from '../useInvalidateQueries';

const useGetPerson = (id: string) => {
    return useQuery<PersonReadDto, Error>({
        queryKey: [Resource.Person, { id }],
        queryFn: async () => (await api.personFindOne(id)).data,
        enabled: !!id,
    });
};

const useGetPersonList = () => {
    return useQuery<PersonListItemDto[], Error>({
        queryKey: [Resource.Person],
        queryFn: async () => {
            return (await api.personFindAll()).data.items?.sort((a: PersonListItemDto, b: PersonListItemDto) =>
                a.fullName?.toUpperCase().localeCompare(b.fullName?.toUpperCase() ?? '') ?? 0,
            );
        },
    });
};

const useCreatePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async (dto: CreatePersonDto): Promise<IdDto> => (await api.personCreate(dto)).data,
        onSuccess: () => {
            invalidateQueries([Resource.Person, Resource.Task]);
        },
    });
};

type UpdatePerson = {
    id: string;
    version: number;
    dto: UpdatePersonDto;
};

const useUpdatePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version, dto }: UpdatePerson): Promise<void> => {
            await api.personUpdate(id, version, dto);
        },
        onSuccess: () => invalidateQueries([Resource.Person, Resource.Task]),
    });
};

type RemovePerson = {
    id: string;
    version: number;
};

const useRemovePerson = () => {
    const { invalidateQueries } = useInvalidateQueries();
    return useMutation({
        mutationFn: async ({ id, version }: RemovePerson) => await api.personRemove(id, version),
        onSuccess: () => invalidateQueries([Resource.Person, Resource.Task]),
    });
};

export { useGetPerson, useGetPersonList, useCreatePerson, useUpdatePerson, useRemovePerson };
