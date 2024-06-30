import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { IPayment, PaymentGroup } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormTextField } from '../../../components/form/FormTextField';
import { InputLabel } from '../../../components/layout/InputLabel';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectPayPeriod } from '../../../components/select/SelectPayPeriod';
import { SelectPaymentType } from '../../../components/select/SelectPaymentType';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { createPayment, getPayment, updatePayment } from '../../../services/payment.service';
import { getDirtyValues } from '../../../services/utils';
import { FormDateField } from '../../../components/form/FormDateField';

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

    const {
        data: payment,
        isError,
        isLoading,
        error,
    } = useQuery<Partial<IPayment>, Error>({
        queryKey: ['payment', { paymentId }],
        queryFn: async () => {
            return await getPayment({ id: paymentId, relations: true });
        },
        enabled: !!paymentId,
    });

    const formSchema = yup.object().shape({
        docNumber: yup.string(),
        docDate: yup.date(),
        accPeriod: yup.date().required('Accounting Period is required'),
        paymentTypeId: yup.number().required('Payment Type is required'),
    });

    type FormType = yup.InferType<typeof formSchema>;

    const {
        control,
        handleSubmit,
        watch,
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
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const updated = paymentId
                ? await updatePayment(paymentId, { ...dirtyValues, version: payment?.version })
                : await createPayment({ ...data, companyId: company.id });
            reset(updated);
            await queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
            setPaymentId(updated.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = async () => {
        reset(payment);
        await queryClient.invalidateQueries({ queryKey: ['payment'], refetchType: 'all' });
    };

    return (
        company &&
        payPeriod && (
            <>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    // onDelete={'disabled'}
                    // onRestoreDeleted={'disabled'}
                    // onShowHistory={'disabled'}
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
                            <Grid item sm={12} lg={3}>
                                <FormTextField
                                    control={control}
                                    autoComplete="given-name"
                                    name="docNumber"
                                    id="docNumber"
                                    label={t('Number')}
                                    type="text"
                                />
                            </Grid>
                            <Grid item sm={12} lg={3}>
                                <FormDateField
                                    control={control}
                                    autoComplete="given-name"
                                    name="docDate"
                                    id="docDate"
                                    label={t('Date')}
                                    // type="text"
                                />
                            </Grid>
                            <Grid item sm={12} lg={6}>
                                <InputLabel>{t('Accounting Period')}</InputLabel>
                                <SelectPayPeriod companyId={company?.id} />
                            </Grid>
                            <Grid item xs={12}>
                                <SelectPaymentType
                                    id={'paymentTypeId'}
                                    name={'paymentTypeId'}
                                    companyId={company?.id}
                                    control={control}
                                    label={t('Type of Payment')}
                                    filter={{ groups: [PaymentGroup.PAYMENTS] }}
                                    // sx={{ fontWeight: 'bold' }}
                                    // autofocus
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
