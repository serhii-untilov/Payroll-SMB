import { api } from '@/api';
import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { FormTextField } from '@/components/form/FormTextField';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import useLocale from '@/hooks/useLocale';
import { usersUpdate } from '@/services/user.service';
import { getDirtyValues, invalidateQueries, snackbarFormErrors } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { ResourceType } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const formSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    language: Yup.string().nullable(),
});

type FormType = Yup.InferType<typeof formSchema>;

export function UserDetails() {
    const { supportedLocales, setLanguage } = useLocale();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useCurrentUser();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: formSchema.cast(user),
        values: formSchema.cast(user),
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    if (isLoading) {
        return <Loading />;
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        if (!user) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = await usersUpdate(user.id, { ...dirtyValues, version: user.version });
            reset(response);
            setLanguage(response?.language);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
        await invalidateQueries(queryClient, [ResourceType.USER]);
    };

    const onCancel = () => {
        reset(user);
    };

    return (
        <>
            <Toolbar
                onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty ? onCancel : 'disabled'}
            />
            <Grid container component="form" noValidate spacing={2}>
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
                            options={[
                                { label: t('System Language'), value: 'sys' },
                                ...(supportedLocales?.map((o) => {
                                    return { label: o.name, value: o.language as string };
                                }) || []),
                            ]}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
