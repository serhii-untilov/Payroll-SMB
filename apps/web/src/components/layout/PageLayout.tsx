import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { PageTitle } from './PageTitle';

interface PageLayoutProps {
    title: string;
    children?: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => {
    const { compactView } = useAppContext();
    return (
        <Box
            my={{ xs: 0, lg: 1, xl: 2 }}
            mx={{ xs: 0, lg: 1, xl: 2 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flex: 1,
            }}
        >
            {compactView && title && (
                <Box mb={{ xs: 0, lg: 1, xl: 2 }}>
                    <PageTitle title={title} />
                </Box>
            )}
            {children}
        </Box>
    );
};

export default PageLayout;
