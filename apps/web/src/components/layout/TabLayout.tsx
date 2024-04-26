import { Box } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { PageTitle } from './PageTitle';
import { PageSubTitle } from './PageSubTitle';

interface Props extends PropsWithChildren {
    title?: string;
}

const TabLayout: FC<Props> = ({ title, children }) => {
    // const { compactView } = useAppContext();
    return (
        <Box
            id="tab-layout"
            // my={{ xs: 0, lg: 1, xl: 1 }}
            // mx={{ xs: 1, lg: 1 }}
            // sx={{
            //     display: 'flex',
            //     flexDirection: 'column',
            //     justifyContent: 'flex-start',
            //     // flexGrow: 1,
            //     // flex: 1,
            // }}
        >
            {/* {compactView && title && ( */}
            {/* {title && (
                <Box mb={{ xs: 0, lg: 1, xl: 1 }}>
                    <PageSubTitle>{title}</PageSubTitle>
                </Box>
            )} */}
            {children}
        </Box>
    );
};

export default TabLayout;
