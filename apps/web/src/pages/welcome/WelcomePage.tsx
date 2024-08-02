import { Box, CssBaseline } from '@mui/material';
import DemoButton from '../../components/DemoButton';
import FeaturesSection from './features/FeaturesSection';
import Footer from './footer/Footer';
import Screenshots from './screenshots/Screenshots';
import Header from './header/Header';
import Layout from './WelcomePage.layout';

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
                    <FeaturesSection />
                    <Screenshots />
                    <Footer />
                </Layout>
            </Box>
        </>
    );
}
