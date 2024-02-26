import { InputLabel, OutlinedInput, OutlinedInputProps } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export type FormTextFieldProps = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
};

export const FormTextField = (props: FormTextFieldProps) => {
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
                        onChange={onChange}
                        value={value}
                        fullWidth
                        {...props}
                        label=""
                    />
                )}
            />
        </>
    );
};
