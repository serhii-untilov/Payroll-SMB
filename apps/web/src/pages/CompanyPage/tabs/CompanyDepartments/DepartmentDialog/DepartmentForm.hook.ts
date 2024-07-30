import { departmentsCreate, departmentsUpdate } from '@/services/api/department.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateDepartmentDto, ResourceType } from '@repo/openapi';
import { maxDate, minDate } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, ObjectSchema, string } from 'yup';
import { snackbarError, snackbarFormErrors } from '../../../../../utils/snackbar';
import { DepartmentFormProps } from './DepartmentForm';

export default function useDepartmentForm(props: DepartmentFormProps) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const formSchema: ObjectSchema<CreateDepartmentDto> = object({
        name: string().required('Name is required').default(''),
        companyId: number().required('Company is required').default(props.company?.id),
        dateFrom: date().default(minDate()),
        dateTo: date().default(maxDate()),
        parentDepartmentId: number().nullable(),
    });

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

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            props.setOpen(false);
            return;
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = props.department
                ? await departmentsUpdate(props.department.id, {
                      ...dirtyValues,
                      version: props.department.version,
                  })
                : await departmentsCreate(data);
            if (props.setDepartmentId) props.setDepartmentId(response.id);
            props.setOpen(false);
            reset();
            await invalidateQueries(queryClient, [ResourceType.Department]);
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset();
        props.setOpen(false);
        await invalidateQueries(queryClient, [ResourceType.Department]);
    };

    return { control, handleSubmit, onSubmit, onCancel };
}
