import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { date2view, view2date } from '@repo/shared';
import { Controller } from 'react-hook-form';
import { InputLabel } from '../layout/InputLabel';

export type FormDateFieldProps = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    defaultValue?: string;
    disabled?: boolean;
};

export const FormDateField = (props: FormDateFieldProps) => {
    const { label } = props;
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <OutlinedInput
                        disabled={!!props?.disabled}
                        size="small"
                        error={error != undefined}
                        onChange={(e) => {
                            onChange(new Date(view2date(e.target.value, props.defaultValue)));
                        }}
                        value={date2view(value)}
                        // inputMode="numeric"
                        fullWidth
                        {...props}
                        label=""
                        type="date"
                    />
                )}
            />
        </>
    );
};
