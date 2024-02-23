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
import { ICreateUser } from '@repo/shared';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink, redirect } from 'react-router-dom';
import { FormTextField } from '../components/form/FormTextField';
import { AppTitle } from '../components/layout/AppTitle';
import { Copyright } from '../components/layout/Copyright';
import { FormTitle } from '../components/layout/FormTitle';
import useAuth from '../hooks/useAuth';

export default function SignUp() {
    const { register } = useAuth();
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            roles: [],
        },
    });

    const onSubmit: SubmitHandler<ICreateUser> = async (data) => {
        console.log(data);
        if (data.email) {
            await register(data);
            redirect('/home');
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
                <FormTitle title="Sign up" />
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormTextField
                                    control={control}
                                    autoComplete="given-name"
                                    name="firstName"
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormTextField
                                    control={control}
                                    id="lastName"
                                    label="Last Name"
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
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                required
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive notifications via email."
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/signin" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}
