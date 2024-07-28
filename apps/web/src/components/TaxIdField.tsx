import { FormTextField } from '@/components/form/FormTextField';
import { useTranslation } from 'react-i18next';

type Props = {
    control: any;
};

export default function TaxIdField({ control }: Props) {
    const { t } = useTranslation();
    return (
        <FormTextField
            control={control}
            required
            label={t('Tax ID')}
            name="taxId"
            type="text"
            autoComplete="taxId"
        />
    );
}
