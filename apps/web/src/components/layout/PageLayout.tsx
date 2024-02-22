import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FC, ReactNode } from 'react';
import { PageTitle } from './PageTitle';

interface PageLayoutProps {
    title: string;
    children?: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => {
    return (
        <Box sx={{ height: 48, py: [1], px: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
            <Box sx={{ flexGrow: 1 }}>
                <PageTitle title={title} />
            </Box>
            {children}
        </Box>
    );
};

export default PageLayout;
