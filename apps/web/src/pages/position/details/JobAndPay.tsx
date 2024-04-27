import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { IPosition, PaymentGroup, formatDate, maxDate, minDate } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectDepartment } from '../../../components/select/SelectDepartment';
import { SelectJob } from '../../../components/select/SelectJob';
import { SelectPaymentType } from '../../../components/select/SelectPaymentType';
import { SelectWorkNorm } from '../../../components/select/SelectWorkNorm';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { getDefaultBasicPaymentTypeId } from '../../../services/paymentType.service';
import { createPosition, getPosition, updatePosition } from '../../../services/position.service';
import { getDirtyValues, getObjectByType } from '../../../services/utils';
import { getDefaultWorkNormId } from '../../../services/workNorm.service';

interface Props {
    positionId: number | null;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    companyId: yup.number().positive('Company is required').required(),

    cardNumber: yup.string().nullable(),
    sequenceNumber: yup.number().nullable(),

    departmentId: yup.number().nullable(),
    jobId: yup.number().nullable(),
    workNormId: yup.number().nullable(),
    paymentTypeId: yup.number().nullable(),
    wage: yup.number().nullable(),
    rate: yup.number().nullable(),

    personId: yup.number().nullable(),

    dateFrom: yup.date().required(),
    dateTo: yup.date().required(),

    deletedUserId: yup.number().nullable(),

    name: yup.string().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

export function JobAndPay({ positionId }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();
    const [defaultBasePaymentTypeId, setDefaultBasePaymentTypeId] = useState<number | undefined>();
    const [defaultWorkNormId, setDefaultWorkNormId] = useState<number | null>();

    useEffect(() => {}, [company]);

    useEffect(() => {
        const fetchDefault = async () => {
            setDefaultBasePaymentTypeId(await getDefaultBasicPaymentTypeId());
            setDefaultWorkNormId(await getDefaultWorkNormId());
        };
        fetchDefault();
    }, []);

    // To prevent Warning: A component is changing an uncontrolled input to be controlled.
    const defaultValues = useMemo((): FormType => {
        return {
            companyId: company?.id || 0,
            workNormId: defaultWorkNormId,
            paymentTypeId: defaultBasePaymentTypeId,
            rate: 1,
            dateFrom: minDate(),
            dateTo: maxDate(),
        };
    }, [company, defaultBasePaymentTypeId, defaultWorkNormId]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
    } = useQuery<FormType, Error>({
        queryKey: ['position', positionId, defaultBasePaymentTypeId],
        queryFn: async () => {
            return formSchema.cast(
                positionId ? await getPosition({ id: positionId, relations: true }) : defaultValues,
            );
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

        const positionData: IPosition = getObjectByType<IPosition>(data);
        const dirtyValues = getDirtyValues(dirtyFields, positionData);
        try {
            const position = data.id
                ? await updatePosition(data.id, dirtyValues)
                : await createPosition(data);
            reset(formSchema.cast(position));
            queryClient.invalidateQueries({ queryKey: ['position', positionId] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onSave = () => {
        handleSubmit(onSubmit);
    };

    const onCancel = () => {
        reset(defaultValues);
        queryClient.invalidateQueries({ queryKey: ['position', positionId] });
    };

    const onDelete = () => {
        console.log('onDelete');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onDelete={position?.id ? onDelete : 'disabled'}
                    onRestoreDeleted={position?.deletedUserId ? onRestoreDeleted : 'disabled'}
                    onPrint={position?.id ? onPrint : 'disabled'}
                    onExport={position?.id ? onExport : 'disabled'}
                    onShowHistory={'disabled'}
                />

                <Grid container xs={12} spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="name"
                            id="name"
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
                            filter={{ groups: [PaymentGroup.BASIC] }}
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
