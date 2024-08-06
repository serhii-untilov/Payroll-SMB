import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';

type EmailFieldProps = {
    control: any;
    autoFocus?: boolean;
    sx?: any;
};

export default function EmailField(props: EmailFieldProps) {
    return (
        <FormTextField
            autoFocus={!!props.autoFocus}
            required
            control={props.control}
            id="email"
            name="email"
            autoComplete="email"
            label={t('Email Address')}
            type="email"
            sx={props.sx}
        />
    );
}
