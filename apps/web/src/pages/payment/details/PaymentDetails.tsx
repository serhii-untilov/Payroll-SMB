import { FormDateField } from '@/components/form/FormDateField';
import { FormNumberField } from '@/components/form/FormNumberField';
import { FormTextField } from '@/components/form/FormTextField';
import { InputLabel } from '@/components/layout/InputLabel';
import { Toolbar } from '@/components/layout/Toolbar';
import { SelectAccPeriod } from '@/components/select/SelectAccPeriod';
import { SelectPaymentType } from '@/components/select/SelectPaymentType';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import {
    paymentsCreate,
    paymentsFindOne,
    paymentsProcess,
    paymentsUpdate,
    paymentsWithdraw,
} from '@/services/payment.service';
import { getDirtyValues, invalidateQueries, snackbarError } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, OutlinedInput } from '@mui/material';
import { Payment } from '@repo/openapi';
import { PaymentGroup, PaymentStatus, ResourceType } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

type Props = {
    paymentId: number;
    setPaymentId: (paymentId: number) => void;
};

export function PaymentDetails(props: Props) {
    const { paymentId, setPaymentId } = props;
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    const { data: payment } = useQuery<Payment, Error>({
        queryKey: [ResourceType.PAYMENT, { paymentId, relations: true }],
        queryFn: async () => {
            const payment = await paymentsFindOne(paymentId, { relations: true });
            return {
                ...payment,
                mandatoryPayments: (payment?.deductions || 0) + (payment?.funds || 0),
                total: (payment?.paySum || 0) + (payment?.deductions || 0) + (payment?.funds || 0),
            };
        },
        enabled: !!paymentId,
    });

    const formSchema = yup.object().shape({
        docNumber: yup.string(),
        docDate: yup.date(),
        accPeriod: yup.date().required('Accounting Period is required'),
        paymentTypeId: yup.number().required('Payment Type is required'),
        baseSum: yup.number(),
        deductions: yup.number(),
        paySum: yup.number(),
        funds: yup.number(),
        status: yup.string(), // See enum PaymentStatus
        description: yup.string(),
        mandatoryPayments: yup.number(),
        total: yup.number(),
    });

    type FormType = yup.InferType<typeof formSchema>;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: (payment as FormType) || {},
        values: (payment as FormType) || {},
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        for (const key of Object.keys(formErrors)) {
            if (formErrors[key]?.message) {
                enqueueSnackbar(t(formErrors[key]?.message), { variant: 'error' });
            }
        }
    }, [formErrors, t]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        if (!company?.id) return;
        if (!payPeriod) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = payment
                ? await paymentsUpdate(paymentId, {
                      ...dirtyValues,
                      version: payment.version,
                  })
                : await paymentsCreate({
                      ...data,
                      companyId: company.id,
                      payPeriod: payPeriod,
                  });
            reset(response);
            await invalidateQueries(queryClient, [ResourceType.PAYMENT]);
            setPaymentId(response.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset(payment);
        await invalidateQueries(queryClient, [ResourceType.PAYMENT]);
    };

    const onProcess = async () => {
        if (payment) {
            await paymentsProcess(payment?.id, { version: payment.version });
            await invalidateQueries(queryClient, [ResourceType.PAYMENT]);
        }
    };

    const onWithdraw = async () => {
        if (payment) {
            await paymentsWithdraw(payment.id, { version: payment.version });
            await invalidateQueries(queryClient, [ResourceType.PAYMENT]);
        }
    };

    return (
        company &&
        payPeriod && (
            <>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onProcess={payment?.status === PaymentStatus.DRAFT ? onProcess : 'disabled'}
                    onWithdraw={payment?.status !== PaymentStatus.DRAFT ? onWithdraw : 'disabled'}
                />
                <Grid
                    container
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    spacing={2}
                    sx={{ mb: 1 }}
                >
                    <Grid item md={12} lg={10} xl={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} lg={3}>
                                <FormTextField
                                    disabled={!!paymentId}
                                    control={control}
                                    name="docNumber"
                                    label={t('Number')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={3}>
                                <FormDateField
                                    disabled={!!paymentId}
                                    control={control}
                                    name="docDate"
                                    label={t('Date')}
                                    // type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={6}>
                                <InputLabel>{t('Status')}</InputLabel>
                                <OutlinedInput
                                    disabled={!!paymentId}
                                    size="small"
                                    fullWidth
                                    name="status"
                                    value={t(payment?.status || PaymentStatus.DRAFT)}
                                    type="text"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} lg={6}>
                                <SelectPaymentType
                                    disabled={!!paymentId}
                                    autoFocus
                                    name={'paymentTypeId'}
                                    companyId={company?.id}
                                    control={control}
                                    label={t('Type of Payment')}
                                    filter={{ groups: [PaymentGroup.PAYMENTS] }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={6}>
                                <SelectAccPeriod
                                    disabled={!!paymentId}
                                    control={control}
                                    companyId={company?.id}
                                    name="accPeriod"
                                    label={t('Accounting Period')}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="baseSum"
                                    label={t('Gross Pay')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="deductions"
                                    label={t('Deductions')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="paySum"
                                    label={t(
                                        payment?.status === PaymentStatus.PAYED
                                            ? PaymentStatus.PAYED
                                            : 'Net Pay',
                                    )}
                                    type="text"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="funds"
                                    label={t('Funds')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="mandatoryPayments"
                                    label={t('Mandatory Payments')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <FormNumberField
                                    disabled
                                    control={control}
                                    name="total"
                                    label={t('Total')}
                                    type="text"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container></Grid>
            </>
        )
    );
}
