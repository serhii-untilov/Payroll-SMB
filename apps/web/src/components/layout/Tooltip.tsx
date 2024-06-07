import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

export const Tooltip = styled(({ className, ...props }: TooltipProps) => (
    <MuiTooltip
        enterDelay={800}
        leaveDelay={100}
        // enterNextDelay={5000}
        // disableTouchListener={true}
        {...props}
        classes={{ popper: className }}
    />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        fontWeight: 400,
        fontSize: '1rem',
        boxShadow: theme.shadows[2],
        color: 'common.white',
        backgroundColor: '#757575',
        padding: '0.5rem',
        transparent: 0,
    },
}));
