import { personsFindOne } from '@/services/person.service';
import { Person, ResourceType } from '@repo/openapi';
import { useQuery } from '@tanstack/react-query';

export function usePerson(id: number) {
    return useQuery<Person, Error>({
        queryKey: [ResourceType.Person, { id }],
        queryFn: async () => await personsFindOne(id),
    });
}
