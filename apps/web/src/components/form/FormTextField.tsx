import { Controller } from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';

export type FormTextFieldProps = TextFieldProps & {
    name: string;
    control: any;
    label: string;
};

export const FormTextField = (props: FormTextFieldProps) => {
    return (
        <Controller
            name={props.name}
            control={props.control}
            render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    variant="outlined"
                    {...props}
                />
            )}
        />
    );
};
