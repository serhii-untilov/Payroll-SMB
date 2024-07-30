import { t } from 'i18next';
import { FormTextField, FormTextFieldProps } from './form/FormTextField';

type FirstNameProps = Partial<FormTextFieldProps> & {
    control: any;
};

export default function FirstNameField(props: FirstNameProps) {
    return (
        <FormTextField
            {...props}
            control={props.control}
            id={props.id ?? 'firstName'}
            name={props.name ?? 'firstName'}
            autoComplete={props.autoComplete ?? 'firstName'}
            label={props.label ?? t('First Name')}
            type="text"
        />
    );
}
