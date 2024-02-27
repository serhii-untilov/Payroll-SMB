import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton, InputAdornment } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { IAuth } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, redirect } from 'react-router-dom';
import { FormTextField } from '../components/form/FormTextField';
import { AppTitle } from '../components/layout/AppTitle';
import { Copyright } from '../components/layout/Copyright';
import useAuth from '../hooks/useAuth';
import useLocale from '../hooks/useLocale';
import { errorMessage } from '../services/utils';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
});

type FormType = Yup.InferType<typeof formSchema>;

const defaultValues: FormType = {
    email: '',
    password: '',
};

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        values: defaultValues,
        defaultValues: defaultValues,
        resolver: yupResolver(formSchema),
        shouldFocusError: true,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        errors.email?.message && enqueueSnackbar(t(errors.email?.message), { variant: 'error' });
        errors.password?.message &&
            enqueueSnackbar(t(errors.password?.message), { variant: 'error' });
    }, [errors, t]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit: SubmitHandler<IAuth> = async (data) => {
        try {
            await login(data);
            redirect('/dashboard');
        } catch (e) {
            enqueueSnackbar(t(errorMessage(e)), { variant: 'error' });
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
                {/* <FormTitle title={t('Sign In')} /> */}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormTextField
                        control={control}
                        id="email"
                        label={t('Email Address')}
                        name="email"
                        autoComplete="email"
                        type="email"
                        autoFocus
                        sx={{ mb: [2] }}
                    />

                    <FormTextField
                        control={control}
                        required
                        id="password"
                        name="password"
                        label={t('Password')}
                        type={showPassword ? 'text' : 'password'}
                        rules={{
                            required: true,
                        }}
                        autoComplete="current-password"
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label={t('Remember me')}
                        sx={{ mb: 2 }}
                    />

                    <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
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
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
