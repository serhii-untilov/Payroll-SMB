import { CreatePersonDto } from '@repo/openapi';
import { useMemo } from 'react';

const defaultValues: CreatePersonDto = {
    lastName: '',
    firstName: '',
    middleName: '',
    taxId: '',
} as const;

export function useDefaultValue() {
    return useMemo<CreatePersonDto>(() => defaultValues, []);
}
