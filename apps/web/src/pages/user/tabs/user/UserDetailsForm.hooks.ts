import useLocale from '@/hooks/context/useLocale';
import { useUpdateUser } from '@/hooks/queries/useUser';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { InferType, object, string } from 'yup';

const useUserDetailsForm = ({ user }) => {
    const { setLanguage } = useLocale();
    const updateUser = useUpdateUser();
    const formSchema = useFormSchema();
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

    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors]);

    const save = useCallback(
        async (data: FormType) => {
            const dirtyValues = getDirtyValues(dirtyFields, data);
            return await updateUser.mutateAsync({
                id: user.id,
                dto: {
                    ...dirtyValues,
                    version: user.version,
                },
            });
        },
        [dirtyFields, updateUser, user.id, user.version],
    );

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty || !user) return;
            try {
                const response = await save(data);
                reset(response);
                setLanguage(response?.language);
            } catch (e: unknown) {
                const error = e as AxiosError;
                enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
            }
        },
        [isDirty, reset, save, setLanguage, user],
    );

    const onCancel = useCallback(() => {
        reset(formSchema.cast(user));
    }, [formSchema, user, reset]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
};

function useFormSchema() {
    return useMemo(
        () =>
            object().shape({
                firstName: string().required('First name is required'),
                lastName: string().required('Last name is required'),
                email: string().required('Email is required').email('Email is invalid'),
                language: string().nullable(),
            }),
        [],
    );
}

export default useUserDetailsForm;
