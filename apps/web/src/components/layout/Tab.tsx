import { Tab as MuiTab, TabProps } from '@mui/material';

interface Props extends TabProps {
    disabled?: boolean;
}

export function Tab({ label, disabled, ...other }: Props) {
    return disabled ? (
        <MuiTab wrapped={true} label={label} disabled {...other} />
    ) : (
        <MuiTab wrapped={true} label={label} {...other} />
    );
}
