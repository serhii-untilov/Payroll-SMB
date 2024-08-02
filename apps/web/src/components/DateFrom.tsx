import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';

const DateFrom = ({ control }) => {
    const { t } = useTranslation();
    return (
        <FormDateField
            control={control}
            autoComplete="date-from"
            name="dateFrom"
            id="dateFrom"
            label={t('Date From')}
        />
    );
};

export default DateFrom;
