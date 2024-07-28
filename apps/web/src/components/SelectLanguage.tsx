import { t } from 'i18next';
import { FormInputDropdown } from './form/FormInputDropdown';
import useLocale from '@/hooks/useLocale';

interface SelectLanguageProps {
    control: any;
}

export default function SelectLanguage({ control }: SelectLanguageProps) {
    const { supportedLocales } = useLocale();
    return (
        <FormInputDropdown
            control={control}
            id="language"
            name="language"
            autoComplete="language"
            label={t('Language')}
            type="text"
            options={[
                { label: t('System Language'), value: 'sys' },
                ...(supportedLocales?.map((o) => {
                    return { label: o.name, value: o.language as string };
                }) || []),
            ]}
        />
    );
}
