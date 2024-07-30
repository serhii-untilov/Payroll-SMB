import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';

interface DateToProps {
    control: any;
}

export default function DateTo(props: DateToProps) {
    const { t } = useTranslation();
    return (
        <FormDateField
            control={props.control}
            autoComplete="date-to"
            name="dateTo"
            id="dateTo"
            label={t('Date To')}
        />
    );
}
