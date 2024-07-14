import { FormDateField } from '@/components/form/FormDateField';
import { FormNumberField } from '@/components/form/FormNumberField';
import { FormSequenceField } from '@/components/form/FormSequenceField';
import { FormTextField } from '@/components/form/FormTextField';
import TabLayout from '@/components/layout/TabLayout';
import { Toolbar } from '@/components/layout/Toolbar';
import { SelectDepartment } from '@/components/select/SelectDepartment';
import { SelectJob } from '@/components/select/SelectJob';
import { SelectPaymentType } from '@/components/select/SelectPaymentType';
import { SelectPerson } from '@/components/select/SelectPerson';
import { SelectWorkNorm } from '@/components/select/SelectWorkNorm';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { createPosition, getPosition, updatePosition } from '@/services/position.service';
import {
    createPositionHistory,
    findLastPositionHistoryOnPayPeriodDate,
    updatePositionHistory,
} from '@/services/positionHistory.service';
import { getDirtyValues } from '@/utils';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddCircleRounded, HistoryRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import {
    formatDate,
    ICreatePosition,
    ICreatePositionHistory,
    IPosition,
    IPositionHistory,
    MAX_SEQUENCE_NUMBER,
    maxDate,
    minDate,
    PaymentGroup,
    toDate,
} from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';

interface Props {
    positionId?: number | null;
    onSubmitCallback: (positionId) => void;
}

export function JobAndPay(props: Props) {
    const { onSubmitCallback } = props;
    const [positionId, setPositionId] = useState(Number(props.positionId));
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
        isLoading: isPositionLoading,
    } = useQuery<IPosition, Error>({
        queryKey: ['position', { positionId }],
        queryFn: async () => await getPosition({ id: positionId, relations: true }),
        enabled: !!positionId,
    });

    const {
        data: positionHistory,
        isError: isPositionHistoryError,
        error: positionHistoryError,
        isLoading: isPositionHistoryLoading,
    } = useQuery<IPositionHistory, Error>({
        queryKey: ['positionHistory', 'last', { positionId }],
        queryFn: async () => {
            return await findLastPositionHistoryOnPayPeriodDate(
                positionId,
                toDate(company?.payPeriod) || new Date(),
                true,
            );
        },
        enabled: !!positionId && !!company?.payPeriod,
    });

    const formSchema = object().shape({
        // Position
        cardNumber: string().ensure(),
        sequenceNumber: number().default(MAX_SEQUENCE_NUMBER),
        description: string().ensure(),
        personId: number().required().nullable(),
        fullName: string().nullable(),
        dateFrom: date().required().default(minDate()),
        dateTo: date().required().default(maxDate()),
        name: string().nullable(),
        // A PositionHistory record actual on the current PayPeriod
        departmentId: number().nullable(),
        jobId: number().nullable(),
        workNormId: number().nullable(),
        paymentTypeId: number().nullable(),
        wage: number().nullable().notRequired().optional(),
        rate: number().nullable().notRequired().optional().min(0).max(2),
        positionHistoryVersion: number().nullable(),
    });

    type FormType = InferType<typeof formSchema>;

    const position_formData = useCallback(
        (
            position: IPosition | undefined,
            positionHistory: IPositionHistory | undefined,
        ): FormType => {
            return {
                // Position fields
                cardNumber: position?.cardNumber || '',
                sequenceNumber: position?.sequenceNumber || MAX_SEQUENCE_NUMBER,
                description: position?.description || '',
                personId: position?.personId || null,
                fullName: position?.person?.fullName || null,
                dateFrom: position?.dateFrom || minDate(),
                dateTo: position?.dateTo || maxDate(),
                // Position history fields
                departmentId: positionHistory?.departmentId || null,
                jobId: positionHistory?.jobId || null,
                workNormId: positionHistory?.workNormId || null,
                paymentTypeId: positionHistory?.paymentTypeId || null,
                wage: positionHistory?.wage || 0,
                rate: positionHistory?.rate || 0,
            };
        },
        [],
    );

    const formData = useMemo<FormType>(() => {
        return position_formData(position, positionHistory);
    }, [position, positionHistory, position_formData]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: formData,
        values: formData,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({
        control,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    if (isPositionLoading || isPositionHistoryLoading) {
        return <></>;
    }

    if (isPositionError) {
        snackbarError(`${positionError.name}\n${positionError.message}`);
        return <></>;
    }

    if (isPositionHistoryError) {
        snackbarError(`${positionHistoryError.name}\n${positionHistoryError.message}`);
        return <></>;
    }

    const formData_Position = (data: FormType): ICreatePosition => {
        const { cardNumber, sequenceNumber, description, personId, dateFrom, dateTo } = data;
        const companyId = company?.id || 0;
        return { companyId, cardNumber, sequenceNumber, description, personId, dateFrom, dateTo };
    };

    const formData_PositionHistory = (data: FormType): ICreatePositionHistory => {
        const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = data;
        return { departmentId, jobId, workNormId, paymentTypeId, wage: wage || 0, rate: rate || 1 };
    };

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(data);
        }
        if (!data) {
            return;
        }
        const positionData = formData_Position(data);
        const positionHistoryData = formData_PositionHistory(data);
        const positionDirtyValues = getDirtyValues(dirtyFields, positionData, true);
        const positionHistoryDirtyValues = getDirtyValues(dirtyFields, positionHistoryData, true);
        try {
            let pos = position;
            if (Object.keys(positionDirtyValues).length || !position) {
                pos = position
                    ? await updatePosition(position.id, {
                          ...positionDirtyValues,
                          version: position.version,
                      })
                    : await createPosition(positionData);
            }
            let history = positionHistory;
            if (Object.keys(positionHistoryDirtyValues).length) {
                if (!pos?.id) {
                    throw Error('positionId not defined');
                }
                history = positionHistory
                    ? await updatePositionHistory(positionHistory.id, {
                          ...positionHistoryDirtyValues,
                          version: positionHistory.version,
                      })
                    : await createPositionHistory({
                          ...positionHistoryDirtyValues,
                          positionId: pos.id,
                          dateFrom: pos.dateFrom,
                          dateTo: pos.dateTo,
                      });
            }
            if (pos && history) {
                setPositionId(pos.id);
                reset(formSchema.cast(position_formData(pos, history)));
            }
            await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
            await queryClient.invalidateQueries({
                queryKey: ['positionHistory'],
                refetchType: 'all',
            });
            onSubmitCallback(pos?.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset(formData);
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
        await queryClient.invalidateQueries({ queryKey: ['positionHistory'], refetchType: 'all' });
    };

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                />

                <Grid container>
                    <Grid item md={12} lg={10} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <SelectPerson
                                    control={control}
                                    name="personId"
                                    label={t('Full Name')}
                                    autoFocus={!position?.personId}
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
                                <FormSequenceField
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
                                    label={t('Payment Form')}
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
                                <FormNumberField
                                    control={control}
                                    name="wage"
                                    id="wage"
                                    label={t('Wage')}
                                    step={500}
                                    min={0}
                                    autoFocus={!!position?.personId}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormNumberField
                                    control={control}
                                    name="rate"
                                    id="rate"
                                    label={t('Rate')}
                                    step={0.25}
                                    min={0}
                                    max={2}
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
                    </Grid>
                </Grid>

                <Grid container sx={{ mt: 2 }}>
                    <Grid item md={12} lg={10} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                {positionId && position?.personId ? (
                                    <Grid item xs={12}>
                                        <Button startIcon={<HistoryRounded />}>
                                            {t('Assignments History')}
                                        </Button>
                                    </Grid>
                                ) : null}
                                <Grid item xs={12}>
                                    <Button startIcon={<AddCircleRounded />}>
                                        {t('Add Work Address')}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12}>
                                    <Button startIcon={<AddCircleRounded />}>
                                        {t('Add Additional Earning Type')}
                                    </Button>
                                </Grid>
                                {positionId && position?.personId ? (
                                    <Grid item xs={12}>
                                        <Button startIcon={<AddCircleRounded />}>
                                            {t('Add Additional Deduction Type')}
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
