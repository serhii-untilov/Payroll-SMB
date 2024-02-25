import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { supportedLanguages } from '../../context/LocaleContext';
import useLocale from '../../hooks/useLocale';

const options = [
    {
        label: 'English',
        value: 'enUS',
    },
    {
        label: 'Ukrainian',
        value: 'ukUA',
    },
];

export const Locale = () => {
    const { locale, setLanguage } = useLocale();

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as supportedLanguages);
    };

    const generateMenuItems = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };

    return (
        <FormControl variant="standard" sx={{ m: 1, mt: 2, minWidth: 120 }} size="small">
            <InputLabel id="locale-select-label">Language</InputLabel>
            <Select
                fullWidth
                labelId="locale-select-label"
                id="locale-select"
                value={locale.language || 'enUS'}
                onChange={handleChange}
            >
                {generateMenuItems()}
            </Select>
        </FormControl>
    );
};
