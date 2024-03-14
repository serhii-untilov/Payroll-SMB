import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import { Button } from '../components/layout/Button';
import { FormInputDropdown } from '../components/form/FormInputDropdown';
import { FormTextField } from '../components/form/FormTextField';
import PageLayout from '../components/layout/PageLayout';
import { AvatarBox } from '../components/utility/AvatarBox';
import { Loading } from '../components/utility/Loading';
import { supportedLanguages } from '../context/LocaleContext';
import useLocale from '../hooks/useLocale';
import { getCurrentUser } from '../services/auth.service';
import { updateUser } from '../services/user.service';
import { getDirtyValues } from '../services/utils';

const formSchema = Yup.object().shape({
    id: Yup.number(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    language: Yup.string().nullable(),
});

type FormType = Yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    language: '',
};

export default function Profile() {
    const { supportedLocales, setLanguage } = useLocale();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const {
        data: user,
        isError: isQueryError,
        isLoading,
        error: queryError,
    } = useQuery<FormType, Error>('user-profile', async () => {
        return formSchema.cast(await getCurrentUser());
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: user || defaultValues,
        values: user || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.firstName?.message &&
            enqueueSnackbar(t(formErrors.firstName?.message), { variant: 'error' });
        formErrors.lastName?.message &&
            enqueueSnackbar(t(formErrors.lastName?.message), { variant: 'error' });
        formErrors.email?.message &&
            enqueueSnackbar(t(formErrors.email?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isLoading) {
        return <Loading />;
    }

    if (isQueryError) {
        return enqueueSnackbar(`${queryError.name}\n${queryError.message}`, { variant: 'error' });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
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
                spacing={2}
            >
                <Grid item>
                    <AvatarBox />
                </Grid>
                <Grid container item xs={12} sm={7} md={6} lg={4} spacing={2}>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            id="lastName"
                            label={t('Last Name')}
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            required
                            label={t('Email Address')}
                            name="email"
                            type="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormInputDropdown
                            control={control}
                            label={t('Language')}
                            name="language"
                            autoComplete="language"
                            type="text"
                            options={
                                supportedLocales?.map((o) => {
                                    return { label: o.name, value: o.language as string };
                                }) || []
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!isDirty}
                                >
                                    {t('Update')}
                                </Button>
                            </Grid>
                            {isDirty && (
                                <Grid item>
                                    <Button onClick={onCancel} variant="contained" color="warning">
                                        {t('Cancel')}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageLayout>
    );
}
