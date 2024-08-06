import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';

interface PhoneFieldProps {
    control: any;
}

export default function PhoneField({ control }: PhoneFieldProps) {
    return (
        <FormTextField
            required
            control={control}
            id="phone"
            name="phone"
            autoComplete="phone"
            label={t('Phone')}
            type="phone"
        />
    );
}
