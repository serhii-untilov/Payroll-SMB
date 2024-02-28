import { DividerProps, Divider as MuiDivider } from '@mui/material';

export function Divider(props: DividerProps) {
    return <MuiDivider sx={{ mx: [2] }} {...props} />;
}
