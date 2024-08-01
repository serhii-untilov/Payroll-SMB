import { Box, CssBaseline } from '@mui/material';
import DemoButton from '../../components/DemoButton';
import { Features } from './Features';
import { Footer } from './Footer';
import { ScreenshotList } from './Screenshots';
import Header from './Header';
import Layout from './layout';

export default function WelcomePage() {
    return (
        <>
            <Box sx={{ display: 'flex', maxWidth: 'hd2', mx: 'auto' }}>
                <CssBaseline />
                <Layout>
                    <Header />
                    <Box sx={{ display: { xs: 'block', sm: 'none', md: 'none' } }}>
                        <DemoButton />
                    </Box>
                    <Features />
                    <ScreenshotList />
                    <Footer />
                </Layout>
            </Box>
        </>
    );
}
