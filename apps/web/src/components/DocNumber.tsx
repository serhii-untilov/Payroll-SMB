import { useTranslation } from 'react-i18next';
import { FormTextField } from './form/FormTextField';

interface DocNumberProps {
    disabled?: boolean;
    control: any;
}

export default function DocNumber(props: DocNumberProps) {
    const { t } = useTranslation();
    return (
        <FormTextField
            disabled={!!props?.disabled}
            control={props.control}
            name="docNumber"
            label={t('Number')}
            type="text"
        />
    );
}
