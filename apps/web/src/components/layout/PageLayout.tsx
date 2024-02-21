import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { FC, ReactNode } from 'react';

interface PageLayoutProps {
    title: string;
    children?: ReactNode;
}

const PageLayout: FC<PageLayoutProps> = ({ title, children }) => {
    return (
        <Box sx={{ height: 48, py: [1], ml: [5] }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography component="h1" variant="h5" color={grey[800]} noWrap>
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

export default PageLayout;
