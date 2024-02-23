import { Box, Button, Grid, Typography } from '@mui/material';
import { IPublicUserData } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useQuery } from 'react-query';
import { FormTextField } from '../components/form/FormTextField';
import PageLayout from '../components/layout/PageLayout';
import { AvatarGenerator } from '../components/utility/AvatarGenerator';
import { Loading } from '../components/utility/Loading';
import { getCurrentUser } from '../services/auth.service';
import { updateUser } from '../services/user.service';
import { getDirtyValues } from '../services/utils';
import { FormButton } from '../components/form/FormButton';

export default function Profile() {
    const {
        data: user,
        isError,
        isSuccess,
        isLoading,
        error,
    } = useQuery<IPublicUserData | undefined, Error>('user-profile', getCurrentUser);

    const [avatarValue, setAvatarValue] = useState(user?.email);

    const { control, handleSubmit, watch, reset } = useForm({
        defaultValues: user,
        values: user,
    });

    const { dirtyFields, touchedFields, defaultValues, isDirty } = useFormState({
        control,
    });

    const onCancel = () => {
        reset(user);
    };

    const onSubmit: SubmitHandler<IPublicUserData> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        console.log('dirtyValues', dirtyValues);
        if (!data?.id) {
            enqueueSnackbar(`!data?.id`, { variant: 'error' });
            return;
        }
        try {
            const user = await updateUser(data.id, dirtyValues);
            reset(user);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, { variant: 'error' });
    }

    if (isSuccess) {
        if (!user) {
            enqueueSnackbar('User not found.', { variant: 'error' });
            return <></>;
        }
        return (
            <PageLayout title="User Profile">
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ mt: 3, flexWrap: 'wrap' }}
                    display="flex"
                    flexDirection="row"
                >
                    <Box sx={{ mb: 4, mr: { xs: 1, sm: 2, md: 3, lg: 4 } }}>
                        <AvatarGenerator value={watch('email')} />
                        {/* <Typography variant="body2" align="center" color="text.secondary">
                            Avatar depends on email.
                        </Typography> */}
                    </Box>
                    <Grid container xs={12} sm={6} md={6} lg={3} spacing={1}>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                autoComplete="given-name"
                                name="firstName"
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                required
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormButton
                                type="submit"
                                variant="contained"
                                // disabled={!isDirty}
                                color="primary"
                                sx={{ mr: [1] }}
                            >
                                {'Update'}
                            </FormButton>
                            {/* {isDirty && ( */}
                            <FormButton
                                onClick={onCancel}
                                variant="contained"
                                color="error"
                                disabled={!isDirty}
                            >
                                {'Cancel'}
                            </FormButton>
                            {/* )} */}
                        </Grid>
                    </Grid>
                </Box>
            </PageLayout>
        );
    }

    return (
        <>
            <Loading />
        </>
    );
}
