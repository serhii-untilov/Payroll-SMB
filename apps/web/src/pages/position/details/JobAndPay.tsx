import { yupResolver } from '@hookform/resolvers/yup';
import { AddCircleRounded, HistoryRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import {
    IPosition,
    IPositionHistory,
    PaymentGroup,
    formatDate,
    maxDate,
    minDate,
} from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectDepartment } from '../../../components/select/SelectDepartment';
import { SelectJob } from '../../../components/select/SelectJob';
import { SelectPaymentType } from '../../../components/select/SelectPaymentType';
import { SelectPerson } from '../../../components/select/SelectPerson';
import { SelectWorkNorm } from '../../../components/select/SelectWorkNorm';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { createPosition, getPosition, updatePosition } from '../../../services/position.service';
import {
    createPositionHistory,
    findLastPositionHistoryOnPayPeriodDate,
    updatePositionHistory,
} from '../../../services/positionHistory.service';
import { getDirtyValues } from '../../../services/utils';

const formSchema = yup.object().shape({
    // Position
    id: yup.number().nullable(),
    companyId: yup.number().positive('Company is required').required(),
    cardNumber: yup.string().nullable(),
    sequenceNumber: yup.number().nullable(),
    description: yup.string().nullable(),
    personId: yup.number().nullable(),
    fullName: yup.string().nullable(),
    dateFrom: yup.date().required(),
    dateTo: yup.date().required(),
    deletedUserId: yup.number().nullable(),
    name: yup.string().nullable(),
    version: yup.number().nullable(),
    // A PositionHistory record actual on the current PayPeriod
    positionHistoryId: yup.number().nullable(),
    departmentId: yup.number().nullable(),
    jobId: yup.number().nullable(),
    workNormId: yup.number().nullable(),
    paymentTypeId: yup.number().nullable(),
    wage: yup.number().nullable().notRequired().optional(),
    rate: yup.number().nullable().notRequired().optional(),
    positionHistoryVersion: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

interface Props {
    positionId: number | null | undefined;
    onSubmitCallback?: () => void;
}

export function JobAndPay({ positionId, onSubmitCallback }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, payPeriod } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    const getDefaultPosition = () => {
        return {
            companyId: company?.id,
            dateFrom: minDate(),
            dateTo: maxDate(),
            rate: 1,
            personId: null,
        };
    };

    const getFormData = async (positionId: number | null | undefined): Promise<FormType> => {
        const position = positionId
            ? await getPosition({ id: positionId, relations: true })
            : getDefaultPosition();
        const positionHistory =
            positionId && payPeriod
                ? (await findLastPositionHistoryOnPayPeriodDate(positionId, payPeriod, true)) || {}
                : {};
        return formSchema.cast({ ...position_formData(position, positionHistory) });
    };

    const { data, isError, error, isLoading } = useQuery<FormType, Error>({
        queryKey: ['Job & Pay', { positionId }],
        queryFn: () => {
            return getFormData(positionId);
        },
        enabled: !!company && !!payPeriod,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
        watch,
    } = useForm({
        defaultValues: data,
        values: data,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({
        control,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.companyId?.message &&
            enqueueSnackbar(t(formErrors.companyId?.message), { variant: 'error' });
        formErrors.dateFrom?.message &&
            enqueueSnackbar(t(formErrors.dateFrom?.message), { variant: 'error' });
        formErrors.dateTo?.message &&
            enqueueSnackbar(t(formErrors.dateTo?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isLoading) {
        return <></>;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }

    // console.log('watch(personId)', watch('personId'));

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(data);
        }
        if (!data) {
            return;
        }
        if (onSubmitCallback) onSubmitCallback();
        const positionData = formData_Position(data);
        const positionHistoryData = formData_PositionHistory(data);
        const positionDirtyValues = getDirtyValues(dirtyFields, positionData, true);
        const positionHistoryDirtyValues = getDirtyValues(dirtyFields, positionHistoryData, true);
        try {
            let pos = positionData;
            if (Object.keys(positionDirtyValues).length) {
                pos = positionData.id
                    ? await updatePosition(positionData.id, {
                          ...positionDirtyValues,
                          version: positionData.version,
                      })
                    : await createPosition(positionData);
            }
            if (Object.keys(positionHistoryDirtyValues).length) {
                if (!pos.id) {
                    throw Error('positionId not defined');
                }
                data.positionHistoryId
                    ? await updatePositionHistory(data.positionHistoryId, {
                          ...positionHistoryDirtyValues,
                          version: positionHistoryData.version,
                      })
                    : await createPositionHistory({
                          positionId: pos.id,
                          dateFrom: pos.dateFrom,
                          dateTo: pos.dateTo,
                          ...positionHistoryDirtyValues,
                      });
            }
            reset(await getFormData(pos?.id));
            await queryClient.invalidateQueries({ queryKey: ['Job & Pay'], refetchType: 'all' });
            await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
            await queryClient.invalidateQueries({ queryKey: ['payPeriod'], refetchType: 'all' });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = async () => {
        reset(await getFormData(data?.id));
        queryClient.invalidateQueries({ queryKey: ['Job & Pay'], refetchType: 'all' });
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
                    // onDelete={!!data?.id && !data?.deletedUserId ? onDelete : 'disabled'}
                    // onRestoreDeleted={
                    //     !!data?.id && data?.deletedUserId ? onRestoreDeleted : 'disabled'
                    // }
                />

                <Grid container md={12} lg={10} xl={8} spacing={2}>
                    <Grid item xs={12} md={6}>
                        {/* <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="name"
                            id="name"
                            label={t('Full Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                            placeholder={t('Vacancy')}
                        /> */}
                        <SelectPerson
                            control={control}
                            name="personId"
                            label={t('Full Name')}
                            autoFocus={!data?.personId}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormTextField
                            control={control}
                            name="cardNumber"
                            id="cardNumber"
                            label={t('Card Number')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormTextField
                            control={control}
                            name="sequenceNumber"
                            id="sequenceNumber"
                            label={t('Sequence Number')}
                            type="number"
                            rules={{
                                required: false,
                                validate: () => {
                                    return true;
                                },
                            }}
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
                        <SelectPaymentType
                            companyId={company?.id}
                            control={control}
                            name="paymentTypeId"
                            id="paymentTypeId"
                            label={t('Payment Type')}
                            filter={{ groups: [PaymentGroup.BASIC] }}
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

                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="wage"
                            id="wage"
                            label={t('Wage')}
                            type="number"
                            defaultValue={0}
                            autoFocus={!!data?.personId}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="rate"
                            id="rate"
                            label={t('Rate')}
                            type="number"
                            defaultValue={0}
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

                <Grid container sx={{ mt: 2 }}>
                    {positionId && data?.personId && (
                        <Grid item xs={12}>
                            <Button startIcon={<HistoryRounded />}>
                                {t('Assignments History')}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button startIcon={<AddCircleRounded />}>
                            {t('Add Additional Earning Type')}
                        </Button>
                    </Grid>
                    {positionId && data?.personId && (
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>
                                {t('Add Additional Deduction Type')}
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button startIcon={<AddCircleRounded />}>{t('Add Work Address')}</Button>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}

function position_formData(
    position: Partial<IPosition>,
    positionHistory: Partial<IPositionHistory>,
): Partial<FormType> {
    const {
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        version,
    } = position;
    const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = positionHistory;
    return {
        // Position fields
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        fullName: position?.person?.fullName || '',
        dateFrom: dateFrom || minDate(),
        dateTo: dateTo || maxDate(),
        deletedUserId,
        version,
        // Position history fields
        positionHistoryId: positionHistory?.id,
        departmentId,
        jobId,
        workNormId,
        paymentTypeId,
        wage,
        rate,
        positionHistoryVersion: positionHistory?.version,
    };
}

function formData_Position(formData: FormType): IPosition {
    const {
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        version,
    } = formData;
    return {
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        version,
    };
}

function formData_PositionHistory(data: FormType): Partial<IPositionHistory> {
    const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = data;
    return {
        id: data.positionHistoryId,
        departmentId,
        jobId,
        workNormId,
        paymentTypeId,
        wage,
        rate,
        version: data.positionHistoryVersion,
    };
}
