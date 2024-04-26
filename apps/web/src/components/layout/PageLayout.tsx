import { Box, BoxProps } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { PageTitle } from './PageTitle';

interface Props extends BoxProps, PropsWithChildren {
    title?: string;
}

const PageLayout: FC<Props> = ({ title, children, ...other }) => {
    const { compactView } = useAppContext();
    return (
        <Box
            my={{ xs: 0, lg: 1, xl: 1 }}
            mx={{ xs: 0, lg: 1, xl: 1 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flex: 1,
            }}
            {...other}
        >
            {compactView && title && (
                <Box mb={{ xs: 0, lg: 1, xl: 1 }}>
                    <PageTitle>{title}</PageTitle>
                </Box>
            )}
            {children}
        </Box>
    );
};

export default PageLayout;
