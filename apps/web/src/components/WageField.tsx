import { useTranslation } from 'react-i18next';
import { FormNumberField } from './form/FormNumberField';

type WageFieldProps = {
    control: any;
    autoFocus?: boolean;
};

const WageField = ({ control, autoFocus }: WageFieldProps) => {
    const { t } = useTranslation();
    return (
        <FormNumberField
            control={control}
            name="wage"
            id="wage"
            label={t('Wage')}
            step={500}
            min={0}
            autoFocus={autoFocus}
        />
    );
};

export default WageField;
