import useLocale from '@/hooks/context/useLocale';
import { FormControl, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { supportedLanguages } from '../context/LocaleContext';
import { InputLabel } from './layout/InputLabel';

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

export const SelectLocale = () => {
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
