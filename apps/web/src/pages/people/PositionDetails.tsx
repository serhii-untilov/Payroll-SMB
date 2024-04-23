import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { formatDate, maxDate, minDate } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { FormDateField } from '../../components/form/FormDateField';
import { FormTextField } from '../../components/form/FormTextField';
import TabLayout from '../../components/layout/TabLayout';
import { Toolbar } from '../../components/layout/Toolbar';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { createPosition, getPosition, updatePosition } from '../../services/position.service';
import { getDirtyValues } from '../../services/utils';

interface Props {
    id: number | null;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    companyId: yup.number().positive('Company is required').required(),

    fullName: yup.string().nullable(),
    taxId: yup.string().nullable(),
    birthDate: yup.date().nullable(),
    personId: yup.number().nullable(),
    sex: yup.string().nullable(),
    phone: yup.string().nullable(),
    email: yup.string().nullable(),
    photo: yup.string().nullable(),

    cardNumber: yup.string().required(),
    sequenceNumber: yup.number().nullable(),

    departmentId: yup.number().nullable(),
    jobId: yup.number().nullable(),
    workNormId: yup.number().nullable(),
    paymentTypeId: yup.number().nullable(),
    wage: yup.number().nullable(),
    rate: yup.number().nullable(),

    dateFrom: yup.date().nullable(),
    dateTo: yup.date().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

export function PositionDetails({ id }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    // To prevent Warning: A component is changing an uncontrolled input to be controlled.
    const defaultValues = useMemo((): FormType => {
        return {
            id: null,
            companyId: company?.id || 0,

            fullName: '',
            personId: null,
            birthDate: null,
            taxId: '',
            sex: '',
            phone: '',
            email: '',
            photo: '',

            cardNumber: '',
            sequenceNumber: Number.MAX_SAFE_INTEGER,

            departmentId: null,
            jobId: null,
            workNormId: null,
            paymentTypeId: null,
            wage: null,
            rate: null,

            dateFrom: minDate(),
            dateTo: maxDate(),
        };
    }, [company]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
    } = useQuery<FormType, Error>({
        queryKey: ['position', id],
        queryFn: async () => {
            return formSchema.cast(id ? await getPosition(id) : defaultValues);
        },
        enabled: !!company?.id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: position || defaultValues,
        values: position || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.companyId?.message &&
            enqueueSnackbar(t(formErrors.companyId?.message), { variant: 'error' });
        formErrors.dateFrom?.message &&
            enqueueSnackbar(t(formErrors.dateFrom?.message), { variant: 'error' });
        formErrors.dateTo?.message &&
            enqueueSnackbar(t(formErrors.dateTo?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isPositionError) {
        return enqueueSnackbar(`${positionError.name}\n${positionError.message}`, {
            variant: 'error',
        });
    }
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(position);
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const position = data.id
                ? await updatePosition(data.id, dirtyValues)
                : await createPosition(data);
            reset(position);
            queryClient.invalidateQueries({ queryKey: ['position', id] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(defaultValues);
        queryClient.invalidateQueries({ queryKey: ['position', id] });
    };

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={() => {
                        handleSubmit(onSubmit);
                    }}
                    onRestore={onCancel}
                    onDelete={'disabled'}
                    onPrint={'disabled'}
                    onExport={'disabled'}
                />

                <Grid container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="fullName"
                            id="fullName"
                            label={t('Full Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormTextField
                            control={control}
                            name="taxId"
                            id="taxId"
                            label={t('Tax ID')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormDateField
                            control={control}
                            name="birthDate"
                            id="birthDate"
                            label={t('Birth Date')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormTextField
                            control={control}
                            name="sex"
                            id="sex"
                            label={t('Sex')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="phone"
                            id="phone"
                            label={t('Phone')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="email"
                            id="email"
                            label={t('Email')}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="cardNumber"
                            id="cardNumber"
                            label={t('Card Number')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="sequenceNumber"
                            id="sequenceNumber"
                            label={t('Sequence Number')}
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="departmentId"
                            id="departmentId"
                            label={t('Department')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="jobId"
                            id="jobId"
                            label={t('Job')}
                            type="text"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="workNormId"
                            id="workNormId"
                            label={t('Work Norm')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="paymentTypeId"
                            id="paymentTypeId"
                            label={t('Payment Type')}
                            type="text"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="wage"
                            id="wage"
                            label={t('Wage')}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="Rate"
                            id="Rate"
                            label={t('Rate')}
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormDateField
                            control={control}
                            name="dateFrom"
                            id="dateFrom"
                            label={t('Date From')}
                            defaultValue={formatDate(minDate())}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormDateField
                            control={control}
                            name="dateTo"
                            id="dateTo"
                            label={t('Date To')}
                            defaultValue={formatDate(maxDate())}
                        />
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
