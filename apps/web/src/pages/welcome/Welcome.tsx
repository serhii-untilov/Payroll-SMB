import { Box, CssBaseline, useMediaQuery } from '@mui/material';
import { Features } from './details/Features';
import { Footer } from './details/Footer';
import { Header } from './details/Header';

function Welcome() {
    const wideScreen = useMediaQuery('(min-width:440px)');

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
                        height: '100vh',
                        width: '100%',
                        overflow: 'auto',
                        p: [1],
                        background:
                            'linear-gradient(to bottom, #CFE5FD, #ffffff, #ffffff, #ffffff)',
                    }}
                >
                    <Header wideScreen={wideScreen} />
                    <Features />
                    <Footer />
                </Box>
            </Box>
        </>
    );
}

export default Welcome;
