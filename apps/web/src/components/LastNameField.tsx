import { t } from 'i18next';
import { FormTextField, FormTextFieldProps } from './form/FormTextField';

type LastNameProps = Partial<FormTextFieldProps> & {
    control: any;
};

export default function LastNameField(props: LastNameProps) {
    return (
        <FormTextField
            {...props}
            control={props.control}
            id={props.id ?? 'lastName'}
            name={props.name ?? 'lastName'}
            autoComplete={props.autoComplete ?? 'lastName'}
            label={props.label ?? t('Last Name')}
            type="text"
        />
    );
}
