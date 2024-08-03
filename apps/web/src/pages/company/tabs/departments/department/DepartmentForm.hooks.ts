import useLocale from '@/hooks/context/useLocale';
import { useCreateDepartment, useUpdateDepartment } from '@/hooks/queries/useDepartments';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { AppError } from '@/types';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDepartmentDto, ResourceType } from '@repo/openapi';
import { maxDate, minDate } from '@repo/shared';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, ObjectSchema, string } from 'yup';
import { DepartmentFormProps } from './DepartmentForm';

export default function useDepartmentForm(props: DepartmentFormProps) {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();
    const invalidateQueries = useInvalidateQueries();
    const formSchema = useFormSchema(props);
    type FormType = InferType<typeof formSchema>;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: props.department || {},
        values: props.department || {},
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });
    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [props, locale]);
    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const save = useCallback(
        async (data: FormType) => {
            const dirtyValues = getDirtyValues(dirtyFields, data);
            return props.department
                ? await updateDepartment.mutateAsync({
                      id: props.department.id,
                      dto: {
                          ...dirtyValues,
                          version: props.department.version,
                      },
                  })
                : await createDepartment.mutateAsync(data);
        },
        [createDepartment, updateDepartment, dirtyFields, props],
    );

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty) {
                props.setOpen(false);
                return;
            }
            try {
                const response = await save(data);
                if (props.setDepartmentId) props.setDepartmentId(response.id);
                props.setOpen(false);
                reset();
            } catch (e: unknown) {
                const error = e as AppError;
                snackbarError(`${error.code}\n${error.message}`);
            }
        },
        [isDirty, props, reset, save],
    );

    const onCancel = useCallback(async () => {
        reset();
        props.setOpen(false);
        await invalidateQueries([ResourceType.Department]);
    }, [props, invalidateQueries, reset]);

    return { control, handleSubmit, onSubmit, onCancel };
}

function useFormSchema(props: DepartmentFormProps) {
    return useMemo<ObjectSchema<CreateDepartmentDto>>(
        () =>
            object({
                name: string().required('Name is required').default(''),
                companyId: number().required('Company is required').default(props.company?.id),
                dateFrom: date().default(minDate()),
                dateTo: date().default(maxDate()),
                parentDepartmentId: number().nullable(),
            }),
        [props],
    );
}
