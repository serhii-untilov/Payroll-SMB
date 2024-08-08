import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreatePaymentDto, ResourceType, UpdatePaymentDto } from '@repo/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { PaymentDetailsProps } from './PaymentDetailsTab';
import { AppMessage } from '@/types';
import {
    useCreatePayment,
    useProcessPayment,
    useUpdatePayment,
    useWithdrawPayment,
} from '@/hooks/queries/usePayment';

export default function usePaymentDetails(props: PaymentDetailsProps) {
    const { payment, company, payPeriod, setPaymentId } = props;
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();
    const { locale } = useLocale();
    const formSchema = useFormSchema();
    type FormType = yup.InferType<typeof formSchema>;
    const createPayment = useCreatePayment();
    const updatePayment = useUpdatePayment();
    const processPayment = useProcessPayment();
    const withdrawPayment = useWithdrawPayment();
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
    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const save = useCallback(
        async (data: FormType) => {
            const dirtyValues = getDirtyValues(dirtyFields, data);
            return payment
                ? await updatePayment.mutateAsync({
                      id: payment.id,
                      dto: {
                          ...(dirtyValues as UpdatePaymentDto),
                          version: payment.version,
                      },
                  })
                : await createPayment.mutateAsync({
                      ...(data as CreatePaymentDto),
                      companyId: company.id,
                      payPeriod: payPeriod.dateFrom,
                  });
        },
        [company.id, createPayment, dirtyFields, payPeriod, payment, updatePayment],
    );

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        try {
            const response = await save(data);
            reset(response);
            if (setPaymentId) setPaymentId(response.id);
        } catch (e: unknown) {
            snackbarError(e as AppMessage);
        }
    };

    const onCancel = async () => {
        reset((payment as FormType) || {});
        await invalidateQueries([ResourceType.Payment, ResourceType.PaymentPosition]);
    };

    const onProcess = async () => {
        if (payment) {
            await processPayment.mutateAsync({ id: payment.id, dto: { version: payment.version } });
        }
    };

    const onWithdraw = async () => {
        if (payment) {
            await withdrawPayment.mutateAsync({
                id: payment.id,
                dto: { version: payment.version },
            });
        }
    };

    return { control, isDirty, handleSubmit, onSubmit, onCancel, onProcess, onWithdraw };
}

function useFormSchema() {
    return useMemo(
        () =>
            yup.object().shape({
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
            }),
        [],
    );
}
