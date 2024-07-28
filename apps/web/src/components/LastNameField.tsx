import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';

interface LastNameProps {
    control: any;
}

export default function LastNameField({ control }: LastNameProps) {
    return (
        <FormTextField
            autoFocus
            control={control}
            id="lastName"
            name="lastName"
            autoComplete="lastName"
            label={t('Last Name')}
            type="text"
        />
    );
}
