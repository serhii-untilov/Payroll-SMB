import EmailField from '@/components/EmailField';
import PasswordField from '@/components/PasswordField';
import RememberMe from '@/components/RememberMe';
import { AppTitle } from '@/components/layout/AppTitle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import useSignInPage from './hooks/SignInPage.hooks';

export default function SignIn() {
    const { t } = useTranslation();
    const { control, handleSubmit, onSubmit, rememberMe, setRememberMe } = useSignInPage();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <AppTitle />
                <Avatar sx={{ m: 1, mb: 2, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <EmailField control={control} autoFocus sx={{ mb: [2] }} />
                    <PasswordField control={control} sx={{ mb: [2] }} />
                    <RememberMe
                        checked={rememberMe}
                        setRememberMe={setRememberMe}
                        sx={{ mb: [2] }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2, color: (theme) => theme.palette.background.default }}
                    >
                        {t('Sign In')}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="#" variant="body2">
                                {t('Forgot password?')}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {t("Don't have an account? Sign Up")}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
