import { t } from 'i18next';
import { FormTextField, FormTextFieldProps } from './form/FormTextField';

type MiddleNameProps = Partial<FormTextFieldProps> & {
    control: any;
};

export default function MiddleNameField(props: MiddleNameProps) {
    return (
        <FormTextField
            {...props}
            control={props.control}
            id={props.id ?? 'middleName'}
            name={props.name ?? 'middleName'}
            autoComplete={props.autoComplete ?? 'middleName'}
            label={props.label ?? t('Middle Name')}
            type="text"
        />
    );
}
