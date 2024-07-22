import { InputLabel } from '@/components/layout/InputLabel';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { Controller } from 'react-hook-form';

type Props = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    autoFocus?: boolean;
    step?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
};

export const FormNumberField = (props: Props) => {
    const { label, step, min, max, name, control, rules, autoFocus, disabled, ...other } = props;
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <OutlinedInput
                        disabled={!!disabled}
                        autoFocus={props?.autoFocus}
                        size="small"
                        type="number"
                        inputProps={{
                            // maxLength: 13,
                            step: step || 1,
                            min: min,
                            max: max,
                        }}
                        error={error != undefined}
                        onChange={(e) => {
                            onChange(e.target.value || 0);
                        }}
                        value={value || ''}
                        fullWidth
                        {...other}
                        label=""
                    />
                )}
            />
        </>
    );
};
