import { CreatePersonDto, Person } from '@repo/openapi';
import { useCallback, useMemo } from 'react';
import { SelectPersonOption } from './SelectPersonForm';

export default function useForm(personList: Person[]) {
    const getOptionLabel = useCallback((option: SelectPersonOption) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
            return option.inputValue;
        }
        // Regular option
        return option.label || '';
    }, []);

    const defaultValue = useMemo<CreatePersonDto>(() => {
        return {
            lastName: '',
            firstName: '',
            middleName: '',
            taxId: '',
        };
    }, []);

    const options = useMemo(() => {
        return personList
            ?.map((o) => {
                return { inputValue: '', label: o.fullName || '', value: o.id };
            })
            .sort((a, b) => a.label.toUpperCase().localeCompare(b.label.toUpperCase()));
    }, [personList]);

    return { getOptionLabel, defaultValue, options };
}
