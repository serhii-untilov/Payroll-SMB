import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title?: string;
}

const TabLayout: FC<Props> = ({ title, children }) => {
    return <Box id="tab-layout">{children}</Box>;
};

export default TabLayout;
