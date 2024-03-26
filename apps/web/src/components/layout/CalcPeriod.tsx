import { Select } from '@mui/material';
import useAppContext from '../../hooks/useAppContext';

export function CalcPeriod() {
    const { company } = useAppContext();

    const generateOptions = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };

    return (
        <Select
            size="small"
            margin="none"
            fullWidth
            error={!!error}
            onChange={onChange}
            value={value || ''}
            // sx={{ mb: 2 }}
            {...props}
            label={''}
        >
            {generateOptions()}
        </Select>
    );
}
