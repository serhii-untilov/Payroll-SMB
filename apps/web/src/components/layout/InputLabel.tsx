import { InputLabel as MuiInputLabel, InputLabelProps } from '@mui/material';
import { grey } from '@mui/material/colors';

export function InputLabel(props: InputLabelProps) {
    const { children } = props;
    return <MuiInputLabel sx={{ color: grey[700] }}>{children}</MuiInputLabel>;
}
