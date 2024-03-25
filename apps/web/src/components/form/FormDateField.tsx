import { Input, InputLabel, OutlinedInput, OutlinedInputProps, TextField } from '@mui/material';
import { date2view, view2date } from '@repo/utils';
import { Controller } from 'react-hook-form';

export type FormDateFieldProps = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    defaultValue?: string;
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
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                    <OutlinedInput
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
