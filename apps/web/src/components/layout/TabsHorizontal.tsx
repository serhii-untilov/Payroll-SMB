import { Tabs, TabsProps } from '@mui/material';

export function TabsHorizontal({ value, onChange, children, ...other }: TabsProps) {
    return (
        <Tabs
            variant="scrollable"
            allowScrollButtonsMobile
            value={value}
            onChange={onChange}
            // textColor={'inherit'}
            // indicatorColor="primary"
            sx={{
                '.MuiTab-wrapped': {
                    // alignItems: 'self-center',
                    // justifyContent: 'flex-center',
                    fontSize: '0.875rem',
                    // textTransform: 'capitalize',
                    fontWeight: 500,
                },
                '.Mui-disabled': {
                    color: (theme) => theme.palette.grey[500],
                },
                '.Mui-selected': {
                    // fontWeight: 'bold',
                },
            }}
            {...other}
        >
            {children}
        </Tabs>
    );
}
