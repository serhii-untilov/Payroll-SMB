import { FormTextField } from '@/components/form/FormTextField';
import { useTranslation } from 'react-i18next';

type Props = {
    control: any;
};

export default function CompanyNameField({ control }: Props) {
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
}
