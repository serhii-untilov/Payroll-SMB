import { FormTextField } from '@/components/form/FormTextField';
import { useTranslation } from 'react-i18next';

const CompanyNameField = ({ control }) => {
    const { t } = useTranslation();
    return (
        <FormTextField
            control={control}
            autoComplete="given-name"
            name="name"
            id="name"
            label={t('Name')}
            type="text"
            autoFocus
            sx={{ fontWeight: 'bold' }}
        />
    );
};

export default CompanyNameField;
