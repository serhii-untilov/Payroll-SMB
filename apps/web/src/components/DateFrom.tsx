import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';

interface DateFromProps {
    control: any;
}

export default function DateFrom(props: DateFromProps) {
    const { t } = useTranslation();
    return (
        <FormDateField
            control={props.control}
            autoComplete="date-from"
            name="dateFrom"
            id="dateFrom"
            label={t('Date From')}
        />
    );
}
