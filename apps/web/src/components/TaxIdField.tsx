import { FormTextField, FormTextFieldProps } from '@/components/form/FormTextField';
import { useTranslation } from 'react-i18next';

type TaxIdProps = Partial<FormTextFieldProps> & {
    control: any;
};

export default function TaxIdField(props: TaxIdProps) {
    const { t } = useTranslation();
    return (
        <FormTextField
            {...props}
            control={props.control}
            id={props.id ?? 'taxId'}
            name={props.name ?? 'taxId'}
            autoComplete={props.autoComplete ?? 'taxId'}
            label={props.label ?? t('Tax ID')}
            type="text"
        />
    );
}
