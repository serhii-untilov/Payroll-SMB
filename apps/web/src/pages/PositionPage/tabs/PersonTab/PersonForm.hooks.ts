import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { personsFindOne, personsUpdate } from '@/services/api/person.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResourceType, UpdatePersonDto } from '@repo/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';
import { PersonFormProps } from './PersonForm';
import { AppError } from '@/types';

export default function usePersonForm(props: PersonFormProps) {
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

    const formSchema = useMemo(
        () =>
            object().shape({
                id: number().required(),
                lastName: string().required(),
                firstName: string().required(),
                middleName: string(),
                taxId: string(),
                birthday: date().nullable(),
                sex: string(),
                phone: string(),
                email: string(),
                photo: string(),
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
        defaultValues: props.person,
        values: props.person,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const { dirtyFields, isDirty } = useFormState({ control });

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty) return;
            if (!data) return;
            if (!props.person) return;
            const dirtyValues = getDirtyValues(dirtyFields, data);
            try {
                await personsUpdate(data.id, {
                    ...(dirtyValues as UpdatePersonDto),
                    version: props.person.version,
                });
                const updated = await personsFindOne(props.person.id);
                reset(updated as FormType);
                await invalidateQueries([ResourceType.Person]);
            } catch (e: unknown) {
                const error = e as AppError;
                snackbarError(`${error.code}\n${error.message}`);
            }
        },
        [dirtyFields, isDirty, props, reset, invalidateQueries],
    );

    const onCancel = useCallback(async () => {
        reset(formSchema.cast(props.person));
        await invalidateQueries([ResourceType.Person]);
    }, [formSchema, props, invalidateQueries, reset]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
}