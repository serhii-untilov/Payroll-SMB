import { Box, BoxProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import useAppContext from '../../hooks/useAppContext';

interface Props extends BoxProps, PropsWithChildren {}

const PageLayout: FC<Props> = ({ children, ...other }) => {
    const { compactView } = useAppContext();
    return (
        <Box
            mb={{ xs: 0, lg: 1, xl: 1 }}
            mx={{ xs: 0, lg: 1, xl: 1 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flex: 1,
            }}
            {...other}
        >
            {children}
        </Box>
    );
};

export default PageLayout;
