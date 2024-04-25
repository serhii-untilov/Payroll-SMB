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
import { SelectDepartment } from '../../../components/select/SelectDepartment';
import { SelectJob } from '../../../components/select/SelectJob';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { createPosition, getPosition, updatePosition } from '../../../services/position.service';
import { getDirtyValues } from '../../../services/utils';
import { SelectWorkNorm } from '../../../components/select/SelectWorkNorm';
import { SelectPaymentType } from '../../../components/select/SelectPaymentType';

interface Props {
    positionId: number | null;
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

export function JobAndPay({ positionId }: Props) {
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
            rate: 1,

            dateFrom: minDate(),
            dateTo: maxDate(),
        };
    }, [company]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
    } = useQuery<FormType, Error>({
        queryKey: ['position', positionId],
        queryFn: async () => {
            return formSchema.cast(positionId ? await getPosition(positionId) : defaultValues);
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
            queryClient.invalidateQueries({ queryKey: ['position', positionId] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(defaultValues);
        queryClient.invalidateQueries({ queryKey: ['position', positionId] });
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
                    <Grid item xs={12} md={6}>
                        <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="fullName"
                            id="fullName"
                            label={t('Full Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                            placeholder={t('Vacancy')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="cardNumber"
                            id="cardNumber"
                            label={t('Card Number')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="sequenceNumber"
                            id="sequenceNumber"
                            label={t('Sequence Number')}
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SelectJob
                            companyId={company?.id}
                            control={control}
                            name="jobId"
                            id="jobId"
                            label={t('Job')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectDepartment
                            companyId={company?.id}
                            control={control}
                            name="departmentId"
                            id="departmentId"
                            label={t('Department')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SelectWorkNorm
                            companyId={company?.id}
                            control={control}
                            name="workNormId"
                            id="workNormId"
                            label={t('Work Norm')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectPaymentType
                            companyId={company?.id}
                            control={control}
                            name="paymentTypeId"
                            id="paymentTypeId"
                            label={t('Payment Type')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="wage"
                            id="wage"
                            label={t('Wage')}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="Rate"
                            id="Rate"
                            label={t('Rate')}
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormDateField
                            control={control}
                            name="dateFrom"
                            id="dateFrom"
                            label={t('Date From')}
                            defaultValue={formatDate(minDate())}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
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
