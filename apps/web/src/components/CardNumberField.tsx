import { t } from 'i18next';
import { FormTextField, FormTextFieldProps } from './form/FormTextField';

type CardNumberProps = Partial<FormTextFieldProps> & {
    control: any;
};

export default function CardNumberField(props: CardNumberProps) {
    return (
        <FormTextField
            {...props}
            control={props.control}
            id={props.id ?? 'cardNumber'}
            name={props.name ?? 'cardNumber'}
            autoComplete={props.autoComplete ?? 'cardNumber'}
            label={props.label ?? t('Card Number')}
            type="text"
        />
    );
}
