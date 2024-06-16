import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, redirect, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FormTextField } from '../../components/form/FormTextField';
import { AppTitle } from '../../components/layout/AppTitle';
import { Copyright } from '../../components/layout/Copyright';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import { errorMessage } from '../../services/utils';
import { grey } from '@mui/material/colors';

const formSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
    // roles: Yup.array().required('Role is required'),
});

type FormType = Yup.InferType<typeof formSchema>;

const defaultValues: FormType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // roles: [],
};

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();

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
        errors.firstName?.message &&
            enqueueSnackbar(t(errors.firstName?.message), { variant: 'error' });
        errors.lastName?.message &&
            enqueueSnackbar(t(errors.lastName?.message), { variant: 'error' });
        errors.email?.message && enqueueSnackbar(t(errors.email?.message), { variant: 'error' });
        errors.password?.message &&
            enqueueSnackbar(t(errors.password?.message), { variant: 'error' });
    }, [errors, t]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit: SubmitHandler<ICreateUser> = async (data) => {
        console.log(data);
        if (data.email) {
            try {
                await register(data);
                // redirect('/dashboard');
                navigate('/dashboard');
                return redirect('/dashboard');
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
                                    type="text"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormTextField
                                    control={control}
                                    id="lastName"
                                    label={t('Last Name')}
                                    name="lastName"
                                    type="text"
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
                                            sx={{ color: grey[600] }}
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
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
