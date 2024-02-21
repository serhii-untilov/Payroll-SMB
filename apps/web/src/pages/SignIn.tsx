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
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IAuth } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router-dom';
import { AppTitle } from '../components/app/AppTitle';
import { Copyright } from '../components/app/Copyright';
import { FormTextField } from '../components/form/FormTextField';
import useAuth from '../hooks/useAuth';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

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
        <ThemeProvider theme={defaultTheme}>
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
                    <AppTitle component="h1" variant="h4" />

                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h2" variant="h5">
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{ mt: 1 }}
                    >
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
        </ThemeProvider>
    );
}
