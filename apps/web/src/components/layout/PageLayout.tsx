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
            sx={{
                pt: 1,
                px: 1,
                height: '100%',
            }}
        >
            {compactView && title && (
                // {title && (
                <Box sx={{ flexGrow: 1, mb: 2, mt: 1 }}>
                    <PageTitle title={title} />
                </Box>
            )}
            {children}
        </Box>
    );
};

export default PageLayout;
