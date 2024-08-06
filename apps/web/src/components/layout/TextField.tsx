import { OutlinedInput } from '@mui/material';
import { InputLabel } from './InputLabel';

interface TextFieldProps {
    label: string;
    value?: unknown;
    type?: string;
    onChange: (value) => void;
}

export default function TextField({ label, value, type, onChange }: TextFieldProps) {
    return (
        <>
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                autoFocus
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
