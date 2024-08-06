import { useTranslation } from 'react-i18next';
import { FormNumberField } from './form/FormNumberField';

const RateField = ({ control }) => {
    const { t } = useTranslation();
    return (
        <FormNumberField
            control={control}
            name="rate"
            id="rate"
            label={t('Rate')}
            step={0.25}
            min={0}
            max={2}
        />
    );
};

export default RateField;
