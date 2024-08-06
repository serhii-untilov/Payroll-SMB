import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';
import { formatDate, maxDate } from '@repo/shared';

const DateTo = ({ control }) => {
    const { t } = useTranslation();
    return (
        <FormDateField
            control={control}
            autoComplete="date-to"
            name="dateTo"
            id="dateTo"
            label={t('Date To')}
            defaultValue={formatDate(maxDate())}
        />
    );
};

export default DateTo;
