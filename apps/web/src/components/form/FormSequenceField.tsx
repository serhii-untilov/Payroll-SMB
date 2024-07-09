import { InputLabel } from '@/components/layout/InputLabel';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { MAX_SEQUENCE_NUMBER } from '@repo/shared';
import { Controller } from 'react-hook-form';

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

export const FormSequenceField = (props: Props) => {
    const { label, step, min, max, name, control, rules, autoFocus, ...other } = props;
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                            onChange(e.target.value || MAX_SEQUENCE_NUMBER);
                        }}
                        value={!value || value >= MAX_SEQUENCE_NUMBER ? '' : value}
                        fullWidth
                        {...other}
                        label=""
                    />
                )}
            />
        </>
    );
};
