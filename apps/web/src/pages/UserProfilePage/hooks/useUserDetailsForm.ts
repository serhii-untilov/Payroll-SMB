import useLocale from '@/hooks/context/useLocale';
import { usersUpdate } from '@/services/api/user.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResourceType, User } from '@repo/openapi';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { InferType, object, string } from 'yup';

export default function useUserDetailsForm(user: User) {
    const { setLanguage } = useLocale();
    const queryClient = useQueryClient();

    const formSchema = object().shape({
        firstName: string().required('First name is required'),
        lastName: string().required('Last name is required'),
        email: string().required('Email is required').email('Email is invalid'),
        language: string().nullable(),
    });

    type FormType = InferType<typeof formSchema>;

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

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        if (!user) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = await usersUpdate(user.id, {
                ...dirtyValues,
                version: user.version,
            });
            reset(response);
            setLanguage(response?.language);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
        await invalidateQueries(queryClient, [ResourceType.User]);
    };

    const onCancel = () => {
        reset(formSchema.cast(user));
    };
    return { control, isDirty, handleSubmit, onSubmit, onCancel };
}
