import { Box, CssBaseline } from '@mui/material';
import DemoButton from '../../components/DemoButton';
import { Features } from './sections/Features';
import { Footer } from './sections/Footer';
import { ScreenshotList } from './sections/Screenshots';
import Header from './sections/Header';
import Layout from './sections/Layout';

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
