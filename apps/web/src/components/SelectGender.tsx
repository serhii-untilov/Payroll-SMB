import { Gender } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormAutocomplete } from './form/FormAutocomplete';

interface Props {
    control: any;
    label?: string;
    id?: string;
    name?: string;
}

export function SelectGender({ control, label, id, name }: Props) {
    const { t } = useTranslation();

    const options = useMemo(
        () =>
            Object.values(Gender).map((value) => {
                return { label: t(value), value };
            }, Gender),
        [t],
    );

    return (
        <FormAutocomplete
            valueType={'string'}
            control={control}
            label={label || ''}
            name={name || id || ''}
            id={id || name || ''}
            autoComplete="gender"
            options={options}
        />
    );
}
