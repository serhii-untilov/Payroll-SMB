import { Sex } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormAutocomplete } from './form/FormAutocomplete';

interface Props {
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectSex({ control, label, id, name }: Props) {
    const { t } = useTranslation();

    const options = useMemo(
        () =>
            Object.values(Sex).map((value) => {
                return { label: t(value), value };
            }, Sex),
        [t],
    );

    return (
        <FormAutocomplete
            valueType={'string'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="sex"
            options={options}
        />
    );
}
