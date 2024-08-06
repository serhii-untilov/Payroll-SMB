import { AppTitle } from '@/components/AppTitle';
import { Link } from '@/components/layout/Link';
import { Logo } from '@/components/layout/Logo';
import SignInButton from '@/components/SignInButton';
import SignUpButton from '@/components/SignUpButton';
import ToggleLanguage from '@/components/ToggleLanguage';
import { Box } from '@mui/material';
import { useState } from 'react';
import DemoButton from '../../../components/DemoButton';
import ToggleSidebarButton from '../../../components/ToggleSidebarButton';
import SidebarMenu from '../sidebar/SidebarMenu';
import useHeader from './Header.hooks';

const Header = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const { headerProps, backGroundProps } = useHeader();

    return (
        <>
            <Box id="header" sx={headerProps}>
                <Box sx={backGroundProps}>
                    <Box
                        id="header__left-side"
                        sx={{ my: 'auto', display: 'flex', align: 'stretch', px: 1 }}
                    >
                        <Link to="/dashboard">
                            <Logo disabled={true} />
                        </Link>
                        <Box sx={{ my: 'auto', mx: 2 }}>
                            <Link to="/dashboard">
                                <AppTitle />
                            </Link>
                        </Box>
                    </Box>
                    <Box
                        id="header__right-side"
                        sx={{ my: 'auto', display: 'flex', align: 'center', px: 2, gap: 1 }}
                    >
                        <Box sx={{ display: { xs: 'none', sm: 'block', md: 'block' } }}>
                            <DemoButton />
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                            <SignUpButton />
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                            <SignInButton />
                        </Box>
                        <Box sx={{ display: { xs: 'inline-flex', sm: 'inline-flex', md: 'none' } }}>
                            <ToggleSidebarButton {...{ setShowSidebar }} />
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'inline-flex' } }}>
                            <ToggleLanguage />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <SidebarMenu {...{ showSidebar, setShowSidebar }} />
        </>
    );
};

export default Header;
