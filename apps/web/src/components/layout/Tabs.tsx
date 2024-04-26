import { Tabs as MuiTabs, TabsProps } from '@mui/material';

export function Tabs({ value, onChange, children, sx, ...other }: TabsProps) {
    return (
        <MuiTabs
            variant="scrollable"
            allowScrollButtonsMobile
            value={value}
            onChange={onChange}
            // textColor={'inherit'}
            indicatorColor={'primary'}
            sx={{
                ...{
                    mr: 'auto',
                    my: '1px',
                    borderBottom: 1,
                    borderColor: 'divider',
                    '.MuiTabs-indicator': {
                        height: '2px',
                    },
                    '.MuiTab-wrapped': {
                        // alignItems: 'self-center',
                        // justifyContent: 'flex-center',
                        fontSize: '0.875rem',
                        // textTransform: 'capitalize',
                        fontWeight: 500,
                    },
                    '.Mui-disabled': {
                        // color: (theme) => theme.palette.grey[500],
                        opacity: 0.5,
                    },
                    '.Mui-selected': {
                        // fontWeight: 'bold',
                    },
                },
                ...{ sx },
            }}
            {...other}
        >
            {children}
        </MuiTabs>
    );
}
