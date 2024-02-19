import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * {
 *     label: 'Radio Option 1',
 *     value: '1',
 * },
 */
export type RadioOption = {
    label: string;
    value: number | string;
};

export interface FormInputRadioProps {
    name: string;
    control: any;
    label: string;
    options: RadioOption[];
}

export const FormInputRadioGroup: React.FC<FormInputRadioProps> = ({
    name,
    control,
    label,
    options,
}) => {
    const generateRadioOptions = () => {
        return options.map((singleOption) => (
            <FormControlLabel
                value={singleOption.value}
                label={singleOption.label}
                control={<Radio />}
            />
        ));
    };
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                    <RadioGroup value={value} onChange={onChange}>
                        {generateRadioOptions()}
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
};
