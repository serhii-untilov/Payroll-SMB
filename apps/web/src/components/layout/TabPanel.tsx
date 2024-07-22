import { Box, BoxProps } from '@mui/material';

interface Props extends BoxProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function TabPanel(props: Props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            sx={{ flex: 1 }}
            {...other}
        >
            {value === index && (
                <Box
                    sx={{
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    {children}
                </Box>
            )}
        </Box>
    );
}
