import { InputLabel } from '@/components/layout/InputLabel';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { Controller } from 'react-hook-form';

type Props = OutlinedInputProps & {
    name: string;
    control: any;
    label: string;
    rules?: any;
    autoFocus?: boolean;
    disabled?: boolean;
};

export const FormTextField = (props: Props) => {
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
                            onChange(
                                e.target.value ||
                                    props.defaultValue ||
                                    (props.type === 'number' ? 0 : ''),
                            );
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
};
