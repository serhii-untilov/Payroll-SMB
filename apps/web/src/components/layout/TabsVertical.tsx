import { TabProps, Tabs, TabsProps } from '@mui/material';

export function SetTabProps(index: number): TabProps {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
        wrapped: true,
    };
}

export function TabsVertical({ value, onChange, children, sx, ...other }: TabsProps) {
    return (
        <Tabs
            orientation="vertical"
            value={value}
            onChange={onChange}
            sx={{
                borderRight: 1,
                borderColor: 'divider',
                '.MuiTab-wrapped': {
                    alignItems: 'self-end',
                    justifyContent: 'flex-end',
                    fontSize: '1rem',
                    textTransform: 'none',
                    fontWeight: 'normal',
                },
                '.Mui-disabled': {
                    color: (theme) => theme.palette.grey[500],
                },
                '.Mui-selected': {},
                ...sx,
            }}
            {...other}
        >
            {children}
        </Tabs>
    );
}
