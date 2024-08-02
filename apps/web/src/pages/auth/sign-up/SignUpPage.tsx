import EmailField from '@/components/EmailField';
import FirstNameField from '@/components/FirstNameField';
import LastNameField from '@/components/LastNameField';
import PasswordField from '@/components/PasswordField';
import { AppTitle } from '@/components/layout/AppTitle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import useSignUpPage from './SignUpPage.hooks';

export default function SignUp() {
    const { t } = useTranslation();
    const { control, handleSubmit, onSubmit } = useSignUpPage();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
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
                    <Grid container spacing={2}>
                        <Grid container item spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FirstNameField control={control} autoFocus />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LastNameField control={control} />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <EmailField control={control} />
                        </Grid>
                        <Grid item xs={12}>
                            <PasswordField control={control} />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label={t('I want to receive notifications via email')}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, color: (theme) => theme.palette.background.default }}
                    >
                        {t('Sign Up')}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/signin" variant="body2">
                                {t('Already have an account? Sign in')}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
