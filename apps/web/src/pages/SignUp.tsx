import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton, InputAdornment, Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import { ICreateUser } from '@repo/shared';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router-dom';
import { FormTextField } from '../components/form/FormTextField';
import { AppTitle } from '../components/layout/AppTitle';
import { Copyright } from '../components/layout/Copyright';
import { FormTitle } from '../components/layout/FormTitle';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useLocale from '../hooks/useLocale';
import { useTranslation } from 'react-i18next';
import { enqueueSnackbar } from 'notistack';
import { errorMessage } from '../services/utils';

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            roles: [],
        },
    });

    useEffect(() => {}, [locale]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit: SubmitHandler<ICreateUser> = async (data) => {
        console.log(data);
        if (data.email) {
            try {
                await register(data);
                redirect('/home');
            } catch (e) {
                enqueueSnackbar(t(errorMessage(e)), { variant: 'error' });
            }
        }
    };

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
                {/* <FormTitle title="Sign up" /> */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid container item spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormTextField
                                    control={control}
                                    autoComplete="given-name"
                                    name="firstName"
                                    id="firstName"
                                    label={t('First Name')}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormTextField
                                    control={control}
                                    id="lastName"
                                    label={t('Last Name')}
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                required
                                id="email"
                                label={t('Email Address')}
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                required
                                name="password"
                                label={t('Password')}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label={t('I want to receive notifications via email')}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
