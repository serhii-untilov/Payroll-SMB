import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import { InputLabel } from '../layout/InputLabel';

export type FormTextFieldProps = OutlinedInputProps & {
    name: string;
    control: any;
    label?: string;
    rules?: any;
    autoFocus?: boolean;
    disabled?: boolean;
};

export function FormTextField(props: FormTextFieldProps) {
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
                        disabled={!!props.disabled}
                        autoFocus={props?.autoFocus}
                        size="small"
                        error={error != undefined}
                        onChange={(e) => {
                            onChange(e.target.value || props.defaultValue || (props.type === 'number' ? 0 : ''));
                        }}
                        value={value || ''}
                        fullWidth
                        {...props}
                        label=""
                    />
                )}
            />
        </>
    );
}
