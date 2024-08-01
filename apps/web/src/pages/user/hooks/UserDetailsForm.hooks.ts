import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { usersUpdate } from '@/services/api/user.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResourceType, User } from '@repo/openapi';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { InferType, object, string } from 'yup';

export default function useUserDetailsForm(user: User) {
    const { setLanguage } = useLocale();
    const invalidateQueries = useInvalidateQueries();

    const formSchema = useMemo(
        () =>
            object().shape({
                firstName: string().required('First name is required'),
                lastName: string().required('Last name is required'),
                email: string().required('Email is required').email('Email is invalid'),
                language: string().nullable(),
            }),
        [],
    );

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

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
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
            await invalidateQueries([ResourceType.User]);
        },
        [dirtyFields, invalidateQueries, reset, isDirty, setLanguage, user],
    );

    const onCancel = useCallback(() => {
        reset(formSchema.cast(user));
    }, [formSchema, user, reset]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
}
