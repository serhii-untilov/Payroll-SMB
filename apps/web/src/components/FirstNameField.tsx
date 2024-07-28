import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';

interface FirstNameProps {
    control: any;
}

export default function FirstNameField({ control }: FirstNameProps) {
    return (
        <FormTextField
            autoFocus
            control={control}
            id="firstName"
            name="firstName"
            autoComplete="firstName"
            label={t('First Name')}
            type="text"
        />
    );
}
