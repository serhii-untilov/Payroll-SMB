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
            mt={{ xs: 1, sm: 2 }}
            mx={{ xs: 1, sm: 2 }}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {compactView && title && (
                <Box mb={{ xs: 1, sm: 2 }}>
                    <PageTitle title={title} />
                </Box>
            )}
            {children}
        </Box>
    );
};

export default PageLayout;
