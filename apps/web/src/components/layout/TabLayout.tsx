import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const TabLayout: FC<PropsWithChildren> = ({ children }) => {
    return <Box id="tab-layout">{children}</Box>;
};

export default TabLayout;
