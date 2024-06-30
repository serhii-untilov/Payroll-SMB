import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import { InputLabel } from '../layout/InputLabel';

export type Props = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    autoFocus?: boolean;
    step?: number;
    min?: number;
    max?: number;
};

export const FormNumberField = (props: Props) => {
    const { label, step, min, max, name, control, rules, autoFocus, ...other } = props;
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                    <OutlinedInput
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
