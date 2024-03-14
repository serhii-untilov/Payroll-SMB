import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        // boxShadow: theme.shadows[2],
        // bgcolor: 'red',
        fontWeight: 400,
        fontSize: '1rem',

        backgroundColor:
            theme.palette.mode === 'light'
                ? theme.palette.background.paper
                : theme.palette.primary.light,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[2],
    },
}));
