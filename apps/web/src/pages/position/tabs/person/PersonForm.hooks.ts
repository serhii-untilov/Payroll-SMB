import { api } from '@/api';
import useLocale from '@/hooks/context/useLocale';
import { useUpdatePerson } from '@/hooks/queries/usePerson';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { AppMessage } from '@/types';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { PersonReadDto, Resource, UpdatePersonDto } from '@repo/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, object, string } from 'yup';

const usePersonForm = ({ person }: { person: PersonReadDto }) => {
    const { t } = useTranslation();
    const { invalidateQueries } = useInvalidateQueries();
    const { locale } = useLocale();
    const updatePerson = useUpdatePerson();
    const formSchema = useFormSchema();
    type FormType = InferType<typeof formSchema>;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm<FormType>({
        defaultValues: person as unknown as FormType,
        values: person as unknown as FormType,
        resolver: yupResolver<FormType>(formSchema as any),
        shouldFocusError: true,
    });
    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);
    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const save = useCallback(
        async (data: FormType) => {
            const dirtyValues = getDirtyValues(dirtyFields, data);
            return await updatePerson.mutateAsync({
                id: data.id,
                version: person.version,
                dto: dirtyValues as UpdatePersonDto,
            });
        },
        [dirtyFields, person.version, updatePerson],
    );

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty || !data || !person) return;
            try {
                await save(data);
                const updated = (await api.personFindOne(person.id)).data;
                reset(updated as unknown as FormType);
            } catch (e: unknown) {
                snackbarError(e as AppMessage);
            }
        },
        [isDirty, person, reset, save],
    );

    const onCancel = useCallback(async () => {
        reset(formSchema.cast(person) as unknown as FormType);
        await invalidateQueries([Resource.Person]);
    }, [formSchema, person, invalidateQueries, reset]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
};

function useFormSchema() {
    return useMemo(
        () =>
            object().shape({
                id: string().required(),
                lastName: string().required(),
                firstName: string().required(),
                middleName: string(),
                taxId: string(),
                birthDate: date().nullable(),
                gender: string(),
                phone: string(),
                email: string(),
                photo: string(),
            }),
        [],
    );
}

export default usePersonForm;
