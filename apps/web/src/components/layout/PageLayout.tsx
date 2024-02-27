import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FC, ReactNode } from 'react';
import { PageTitle } from './PageTitle';
import useAppContext from '../../hooks/useAppContext';

interface PageLayoutProps {
    title: string;
    children?: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => {
    const { compactView } = useAppContext();
    return (
        <Box
            sx={{
                pt: { xs: 1, sm: 1 },
                px: { xs: 1, sm: 1 },
            }}
        >
            {compactView && (
                <Box sx={{ flexGrow: 1, height: 48 }}>
                    <PageTitle title={title} />
                </Box>
            )}
            {children}
        </Box>
    );
};

export default PageLayout;
