import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SelectProps } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';
import { InputLabel } from '../layout/InputLabel';

export function Language(props: SelectProps<string>) {
    const { locale, setLanguage, supportedLocales } = useLocale();
    const { t } = useTranslation();

    const onChangeLanguage = (event: SelectChangeEvent<string>) => {
        setLanguage(event.target.value);
    };

    return (
        <>
            <InputLabel id="select-language-label">{t('Language')}</InputLabel>
            <Select
                size="small"
                labelId="select-language-label"
                id="select-language"
                value={locale.language}
                {...props}
                onChange={onChangeLanguage}
            >
                {supportedLocales.map((o) => (
                    <MenuItem value={o.language}>{o.name}</MenuItem>
                ))}
            </Select>
        </>
    );
}
