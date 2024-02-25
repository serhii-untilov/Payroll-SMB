import { InputLabel } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export type FormTextFieldProps = TextFieldProps & {
    name: string;
    control: any;
    label: string;
};

export const FormTextField = (props: FormTextFieldProps) => {
    const { label } = props;
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <Controller
                name={props.name}
                control={props.control}
                render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
                    <TextField
                        helperText={error ? error.message : null}
                        size="small"
                        margin="none"
                        error={!!error}
                        onChange={onChange}
                        value={value}
                        fullWidth
                        variant="outlined"
                        // {...props}
                        label=""
                    />
                )}
            />
        </>
    );
};
