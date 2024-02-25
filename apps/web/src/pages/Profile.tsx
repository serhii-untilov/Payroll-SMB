import { Grid } from '@mui/material';
import { IPublicUserData } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { FormButton } from '../components/form/FormButton';
import { FormInputDropdown } from '../components/form/FormInputDropdown';
import { FormTextField } from '../components/form/FormTextField';
import PageLayout from '../components/layout/PageLayout';
import { AvatarGenerator } from '../components/utility/AvatarGenerator';
import { Loading } from '../components/utility/Loading';
import { supportedLanguages } from '../context/LocaleContext';
import useLocale from '../hooks/useLocale';
import { getCurrentUser } from '../services/auth.service';
import { updateUser } from '../services/user.service';
import { getDirtyValues } from '../services/utils';
import { useEffect } from 'react';

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultUser = {
    firstName: '',
    lastName: '',
    email: '',
    isActive: false,
    language: 'en',
    roles: [],
};

export default function Profile() {
    const { supportedLocales, setLanguage } = useLocale();
    const { t } = useTranslation();

    const {
        data: user,
        isError: isQueryError,
        isLoading,
        error: queryError,
    } = useQuery<IPublicUserData, Error>('user-profile', getCurrentUser);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: user || defaultUser,
        values: user || defaultUser,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    if (isLoading) {
        return <Loading />;
    }

    if (isQueryError) {
        return enqueueSnackbar(`${queryError.name}\n${queryError.message}`, { variant: 'error' });
    }

    const onSubmit: SubmitHandler<IPublicUserData> = async (data) => {
        if (!isDirty) return;
        if (!data?.id) {
            enqueueSnackbar(`!data?.id`, { variant: 'error' });
            return;
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const user = await updateUser(data.id, dirtyValues);
            reset(user);
            user.language && setLanguage(user.language as supportedLanguages);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(user);
    };

    return (
        <PageLayout title={t('User Profile')}>
            <Grid
                container
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                spacing={4}
            >
                <Grid item>
                    <AvatarGenerator value={watch('email')} />
                </Grid>
                <Grid container item xs={12} sm={6} md={6} lg={3} spacing={2}>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            autoComplete="given-name"
                            name="firstName"
                            id="firstName"
                            label={t('First Name')}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            id="lastName"
                            label={t('Last Name')}
                            name="lastName"
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            required
                            label={t('Email Address')}
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormInputDropdown
                            control={control}
                            label={t('Language')}
                            name="language"
                            autoComplete="language"
                            options={supportedLocales.map((o) => {
                                return { label: o.name, value: o.language as string };
                            })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item>
                                <FormButton type="submit" variant="contained" color="primary">
                                    {t('Update')}
                                </FormButton>
                            </Grid>
                            <Grid item>
                                <FormButton
                                    onClick={onCancel}
                                    variant="contained"
                                    color="warning"
                                    disabled={!isDirty}
                                >
                                    {t('Cancel')}
                                </FormButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageLayout>
    );
}
