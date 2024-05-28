import { LoginRounded, PersonRounded } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppTitle } from '../../../components/layout/AppTitle';
import { Button } from '../../../components/layout/Button';
import { Logo } from '../../../components/layout/Logo';

type Props = { wideScreen: boolean };

export function Header({ wideScreen }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const letsGo = () => {
        navigate('/');
    };

    return (
        <Box
            id="header"
            sx={{
                // width: { sm: 300, lg: 800 },
                maxWidth: 'md',
                width: '100%',
                my: 1,
                p: 1,
                // mx: { sm: 8, md: 8, lg: 16, xl: 16 },
                borderRadius: 25,
                display: 'flex',
                // alignItems: 'center',
                justifyContent: 'space-between',
                /* From https://css.glass */
                background: 'rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
                webkitBackdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                // gap: { sm: 0, md: 1, lg: 16, xl: 16 },
            }}
        >
            <Box sx={{ display: 'flex', align: 'center', px: 1 }}>
                <Logo disabled={true} onClick={letsGo} />
                {/* {wideScreen && ( */}
                <AppTitle
                    onClick={letsGo}
                    align="left"
                    sx={{
                        color: 'primary.dark',
                        display: 'inline',
                        my: 'auto',
                        mx: 2,
                        cursor: 'pointer',
                    }}
                />
                {/* )} */}
            </Box>
            <Box sx={{ display: 'flex', align: 'center', px: 2, gap: 0 }}>
                {/* <Button
                                onClick={switchThemeMode}
                                variant="text"
                                size="small"
                                sx={{ borderRadius: 3, height: 38, px: 2, my: 'auto' }}
                            >
                                {themeMode === 'light' ? (
                                    <DarkModeOutlined />
                                ) : (
                                    <LightModeOutlined />
                                )}
                            </Button> */}
                {wideScreen && (
                    <Button
                        href="/login"
                        variant="text"
                        sx={{
                            borderRadius: 3,
                            height: 38,
                            px: 2,
                            my: 'auto',
                        }}
                    >
                        {t('Sign In')}
                    </Button>
                )}
                {!wideScreen && (
                    <IconButton sx={{ color: 'primary.main' }}>
                        <LoginRounded />
                    </IconButton>
                )}
                {wideScreen && (
                    <Button
                        href="/register"
                        variant="text"
                        sx={{
                            borderRadius: 3,
                            height: 38,
                            px: 2,
                            my: 'auto',
                        }}
                    >
                        {t('Sign Up')}
                    </Button>
                )}
                {!wideScreen && (
                    <IconButton sx={{ color: 'primary.main' }}>
                        <PersonRounded />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
