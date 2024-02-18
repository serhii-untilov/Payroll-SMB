import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * {
 *      label: 'Dropdown Option 1',
 *      value: '1',
 *  },
 */
export type DropdownOption = {
    label: string;
    value: number | string;
};

export interface FormInputDropdownProps {
    name: string;
    control: any;
    label: string;
    options: DropdownOption[];
}

export const FormInputDropdown: React.FC<FormInputDropdownProps> = ({
    name,
    control,
    label,
    options,
}) => {
    const generateSingleOptions = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };
    return (
        <FormControl size={'small'}>
            <InputLabel>{label}</InputLabel>
            <Controller
                render={({ field: { onChange, value } }) => (
                    <Select onChange={onChange} value={value}>
                        {generateSingleOptions()}
                    </Select>
                )}
                control={control}
                name={name}
            />
        </FormControl>
    );
};
