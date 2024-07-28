import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';

interface DocDateProps {
    disabled?: boolean;
    control: any;
}

export default function DocDate(props: DocDateProps) {
    const { t } = useTranslation();
    return (
        <FormDateField
            disabled={props.disabled}
            control={props.control}
            name="docDate"
            label={t('Date')}
        />
    );
}
