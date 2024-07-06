import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ICreateDepartment, IDepartment, maxDate, minDate } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Dispatch, Fragment, useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { InferType, ObjectSchema, date, number, object, string } from 'yup';
import { FormDateField } from '../../components/form/FormDateField';
import { FormTextField } from '../../components/form/FormTextField';
import { Button } from '../../components/layout/Button';
import { SelectDepartment } from '../../components/select/SelectDepartment';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import {
    createDepartment,
    getDepartment,
    updateDepartment,
} from '../../services/department.service';
import { getDirtyValues } from '../../services/utils';
import { snackbarError, snackbarFormErrors } from '../../utils/snackbar';

export interface Params {
    open: boolean;
    setOpen: Dispatch<boolean>;
    departmentId: number | null;
    submitCallback?: Dispatch<IDepartment>;
}

export default function DepartmentForm(params: Params) {
    const { submitCallback } = params;
    const departmentId = Number(params.departmentId);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    const {
        data: department,
        isError,
        error,
    } = useQuery<IDepartment | null, Error>({
        queryKey: ['department', { departmentId }],
        queryFn: async () => {
            return departmentId ? await getDepartment(departmentId) : null;
        },
        enabled: !!departmentId,
    });

    const formSchema: ObjectSchema<ICreateDepartment> = object({
        name: string().required('Name is required').default(''),
        companyId: number().required('Company is required').default(company?.id),
        dateFrom: date().required('DateFrom is required').default(minDate()),
        dateTo: date().required('DateTo is required').default(maxDate()),
        parentDepartmentId: number().nullable(),
    });

    type FormType = InferType<typeof formSchema>;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: department || {},
        values: formSchema.cast(department || {}),
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            params.setOpen(false);
            return;
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = department
                ? await updateDepartment(department.id, {
                      ...dirtyValues,
                      version: department.version,
                  })
                : await createDepartment(data);
            if (submitCallback) submitCallback(response);
            params.setOpen(false);
            reset();
            await queryClient.invalidateQueries({ queryKey: ['department'], refetchType: 'all' });
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset();
        params.setOpen(false);
        await queryClient.invalidateQueries({ queryKey: ['department'], refetchType: 'all' });
    };

    return (
        <Fragment>
            <Dialog
                disableRestoreFocus
                open={params.open}
                onClose={async () => {
                    params.setOpen(false);
                    reset();
                    await queryClient.invalidateQueries({
                        queryKey: ['department'],
                        refetchType: 'all',
                    });
                }}
            >
                <DialogTitle>{t('Department')}</DialogTitle>
                <DialogContent>
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                autoComplete="department-name"
                                name="name"
                                id="name"
                                label={t('Name')}
                                type="text"
                                autoFocus
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormDateField
                                control={control}
                                autoComplete="date-from"
                                name="dateFrom"
                                id="dateFrom"
                                label={t('Date From')}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormDateField
                                control={control}
                                autoComplete="date-to"
                                name="dateTo"
                                id="dateTo"
                                label={t('Date To')}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <SelectDepartment
                                companyId={company?.id}
                                control={control}
                                name="departmentId"
                                id="departmentId"
                                label={t('Department')}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2, pt: 0 }}>
                    <Button onClick={handleSubmit(onSubmit)}>{t('Update')}</Button>
                    <Button color="secondary" onClick={onCancel}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
