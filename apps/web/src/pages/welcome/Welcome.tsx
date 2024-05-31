import { Box, CssBaseline } from '@mui/material';
import { Features } from './details/Features';
import { Footer } from './details/Footer';
import { Header } from './details/Header';
import { ScreenshotList } from './details/ScreenshotList';

function Welcome() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    maxWidth: 'hd2',
                    mx: 'auto',
                }}
            >
                <CssBaseline />

                <Box
                    component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flexGrow: 1,
                        flex: 1,
                        width: '100%',
                        overflow: 'auto',
                        p: [1],
                        background:
                            'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)',
                    }}
                >
                    <Header />
                    <Features />
                    <ScreenshotList />
                    <Footer />
                </Box>
            </Box>
        </>
    );
}

export default Welcome;
