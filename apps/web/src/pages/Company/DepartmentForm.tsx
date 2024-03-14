import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IDepartment } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/layout/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useQueryClient } from 'react-query';
import {
    createDepartment,
    getDepartment,
    getDepartmentList,
    updateDepartment,
} from '../../services/department.service';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { Dispatch, FormEvent, Fragment, useEffect, useState } from 'react';
import useLocale from '../../hooks/useLocale';
import { enqueueSnackbar } from 'notistack';
import { maxDate, minDate } from '@repo/utils';
import { Loading } from '../../components/utility/Loading';
import { getDirtyValues } from '../../services/utils';
import { AxiosError } from 'axios';
import { Grid } from '@mui/material';
import { FormTextField } from '../../components/form/FormTextField';
import { FormInputDropdown } from '../../components/form/FormInputDropdown';
import useAppContext from '../../hooks/useAppContext';

export interface DepartmentFormParams {
    open: boolean;
    setOpen: Dispatch<boolean>;
    departmentId: number | null;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required('Name is required'),
    companyId: yup.number().positive('Company is required').required(),
    dateFrom: yup.date(),
    dateTo: yup.date(),
    parentDepartmentId: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: null,
    name: '',
    companyId: 0,
    dateFrom: minDate(),
    dateTo: maxDate(),
    parentDepartmentId: null,
};

export default function DepartmentForm(params: DepartmentFormParams) {
    const { departmentId } = params;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    const {
        data: department,
        isError: isDepartmentError,
        isLoading: isDepartmentLoading,
        error: departmentError,
    } = useQuery<FormType, Error>({
        queryKey: ['department'],
        queryFn: async () => {
            return formSchema.cast(
                departmentId
                    ? await getDepartment(departmentId)
                    : { ...defaultValues, companyId: company?.id },
            );
        },
        enabled: !!company?.id,
    });

    const {
        data: departmentList,
        isError: isDepartmentListError,
        isLoading: isDepartmentListLoading,
        error: departmentListError,
    } = useQuery<IDepartment[], Error>(
        'departmentList',
        async () => {
            return company?.id ? await getDepartmentList(company?.id) : [];
        },
        {
            // The query will not execute until the company Id exists
            enabled: !!company?.id,
        },
    );

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: department || defaultValues,
        values: department || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.name?.message &&
            enqueueSnackbar(t(formErrors.name?.message), { variant: 'error' });
        formErrors.companyId?.message &&
            enqueueSnackbar(t(formErrors.companyId?.message), { variant: 'error' });
        formErrors.dateFrom?.message &&
            enqueueSnackbar(t(formErrors.dateFrom?.message), { variant: 'error' });
        formErrors.dateTo?.message &&
            enqueueSnackbar(t(formErrors.dateTo?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isDepartmentLoading || isDepartmentListLoading) {
        return <Loading />;
    }

    if (isDepartmentError) {
        return enqueueSnackbar(`${departmentError.name}\n${departmentError.message}`, {
            variant: 'error',
        });
    }

    if (isDepartmentListError) {
        return enqueueSnackbar(`${departmentListError.name}\n${departmentListError.message}`, {
            variant: 'error',
        });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const department = data.id
                ? await updateDepartment(data.id, dirtyValues)
                : await createDepartment(data);
            reset(department);
            params.setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['department'] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    // const onCancel = () => {
    //     reset(department);
    //     params.setOpen(false);
    //     queryClient.invalidateQueries({ queryKey: ['department'] });
    // };

    return (
        <Fragment>
            <Dialog
                open={params.open}
                onClose={() => {
                    params.setOpen(false);
                    reset(department);
                    queryClient.invalidateQueries({ queryKey: ['department'] });
                }}
                // PaperProps={{
                //     component: 'form',
                //     onSubmit: (event: FormEvent<HTMLFormElement>) => {
                //         event.preventDefault();
                //         handleSubmit(onSubmit);
                //         params.setOpen(false);
                //     },
                // }}
            >
                <DialogTitle>{t('Department')}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will
                        send updates occasionally.
                    </DialogContentText> */}
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                            <FormTextField
                                control={control}
                                autoComplete="given-name"
                                name="name"
                                id="name"
                                label={t('Name')}
                                type="text"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormTextField
                                control={control}
                                autoComplete="given-name"
                                name="dateFrom"
                                id="dateFrom"
                                label={t('Date From')}
                                type="date"
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormTextField
                                control={control}
                                autoComplete="given-name"
                                name="dateTo"
                                id="dateTo"
                                label={t('Date To')}
                                type="date"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormInputDropdown
                                control={control}
                                label={t('Parent Department')}
                                name="parentDepartmentId"
                                autoComplete="parentDepartmentId"
                                type="number"
                                options={
                                    departmentList?.map((o) => {
                                        return { label: o.name, value: o.id };
                                    }) ?? []
                                }
                            />
                        </Grid>
                        {/* <Grid item xs={12} sx={{ mb: 2 }}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Button type="submit" disabled={!isDirty}>
                                        {t('Update')}
                                    </Button>
                                </Grid>

                                <Grid item>
                                    {isDirty && <Button onClick={onCancel}>{t('Cancel')}</Button>}
                                </Grid>
                            </Grid>
                        </Grid> */}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2, pt: 0 }}>
                    {/* <Button disabled={!isDirty} type="submit">
                        Subscribe
                    </Button> */}
                    <Button onClick={handleSubmit(onSubmit)}>{t('Update')}</Button>
                    {/* <Button onClick={onCancel}>
                        {t('Cancel')}
                    </Button> */}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
