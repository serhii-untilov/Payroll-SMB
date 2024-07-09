import { FormInputDropdown } from '@/components/form/FormInputDropdown';
import { FormTextField } from '@/components/form/FormTextField';
import { Toolbar } from '@/components/layout/Toolbar';
import { Loading } from '@/components/utility/Loading';
import useAuth from '@/hooks/useAuth';
import useLocale from '@/hooks/useLocale';
import { getCurrentUser } from '@/services/auth.service';
import { updateUser } from '@/services/user.service';
import { getDirtyValues } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

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

export function UserDetails() {
    const { supportedLocales, setLanguage } = useLocale();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const {
        data: user,
        isError: isQueryError,
        isLoading,
        error: queryError,
    } = useQuery<FormType, Error>({
        queryKey: ['user', 'current', currentUser],
        queryFn: async () => {
            return formSchema.cast(await getCurrentUser());
        },
    });

    const {
        control,
        handleSubmit,
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
            setLanguage(user?.language || null);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
        await queryClient.invalidateQueries({ queryKey: ['user'], refetchType: 'all' });
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
