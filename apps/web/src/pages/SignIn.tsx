import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router-dom';
import { FormTextField } from '../components/form/FormTextField';
import { AppTitle } from '../components/layout/AppTitle';
import { Copyright } from '../components/layout/Copyright';
import { FormTitle } from '../components/layout/FormTitle';
import useAuth from '../hooks/useAuth';

export default function SignIn() {
    const { login } = useAuth();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<IAuth> = async (data) => {
        console.log(data);
        if (data.email) {
            try {
                await login(data);
                redirect('/home');
            } catch (e: unknown) {
                const error = e as AxiosError;
                enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <FormTitle title="Sign in" />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <FormTextField
                        control={control}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <FormTextField
                        control={control}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
