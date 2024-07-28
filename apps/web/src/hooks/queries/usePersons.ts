import { personsFindAll, personsFindOne } from '@/services/person.service';
import { Person, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePerson(id: number) {
    return useQuery<Person, Error>({
        queryKey: [ResourceType.Person, { id }],
        queryFn: async () => await personsFindOne(id),
    });
}

export function usePersons() {
    return useQuery<Person[], Error>({
        queryKey: [ResourceType.Person],
        queryFn: async () => await personsFindAll(),
    });
}
