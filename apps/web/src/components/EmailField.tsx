import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';

interface EmailFieldProps {
    control: any;
}

export default function EmailField({ control }: EmailFieldProps) {
    return (
        <FormTextField
            required
            control={control}
            id="email"
            name="email"
            autoComplete="email"
            label={t('Email Address')}
            type="email"
        />
    );
}
