import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        boxShadow: theme.shadows[1],
        fontWeight: 400,
        fontSize: '1rem',
    },
}));
