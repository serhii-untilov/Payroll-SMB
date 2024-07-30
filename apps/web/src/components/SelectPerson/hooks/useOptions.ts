import { Person } from '@repo/openapi';
import { useMemo } from 'react';

export function useOptions(personList: Person[]) {
    return useMemo(() => {
        return personList
            ?.map((o) => {
                return { inputValue: '', label: o.fullName || '', value: o.id };
            })
            .sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()));
    }, [personList]);
}
