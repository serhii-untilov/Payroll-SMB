import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormDateField } from './form/FormDateField';
import { formatDate, minDate } from '@repo/shared';

const DateFrom = ({ control }: { control: Control<any> }) => {
    const { t } = useTranslation();
    return (
        <FormDateField
            control={control}
            autoComplete="date-from"
            name="dateFrom"
            id="dateFrom"
            label={t('Date From')}
            defaultValue={formatDate(minDate())}
        />
    );
};

export default DateFrom;
