import { OutlinedInput } from '@mui/material';
import { InputLabel } from './InputLabel';

interface TextFieldProps {
    label: string;
    value?: unknown;
    type?: string;
    onChange: (value) => void;
    autoFocus?: boolean;
}

export default function TextField({ label, value, type, onChange, autoFocus }: TextFieldProps) {
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                autoFocus={!!autoFocus}
                size="small"
                fullWidth
                id="lastName"
                name="lastName"
                label=""
                value={value}
                onChange={(event) => onChange(event.target.value)}
                type={type ?? 'text'}
            />
        </>
    );
}
