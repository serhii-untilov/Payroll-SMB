import { Tab as MuiTab, TabProps } from '@mui/material';

export function Tab({ label, ...other }: TabProps) {
    return <MuiTab wrapped={true} label={label} {...other} />;
}
