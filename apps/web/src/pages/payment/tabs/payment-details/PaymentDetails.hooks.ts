import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import {
    paymentsCreate,
    paymentsProcess,
    paymentsUpdate,
    paymentsWithdraw,
} from '@/services/api/payment.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreatePaymentDto, ResourceType, UpdatePaymentDto } from '@repo/openapi';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { PaymentDetailsProps } from './PaymentDetails';

export default function usePaymentDetails(props: PaymentDetailsProps) {
    const { payment, company, payPeriod, setPaymentId } = props;
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

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

    useEffect(() => {
        for (const key of Object.keys(formErrors)) {
            if (formErrors[key]?.message) {
                enqueueSnackbar(t(formErrors[key]?.message), { variant: 'error' });
            }
        }
    }, [formErrors, t]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = payment
                ? await paymentsUpdate(payment.id, {
                      ...(dirtyValues as UpdatePaymentDto),
                      version: payment.version,
                  })
                : await paymentsCreate({
                      ...(data as CreatePaymentDto),
                      companyId: company.id,
                      payPeriod: payPeriod,
                  });
            reset(response);
            await invalidateQueries([ResourceType.Payment, ResourceType.PaymentPosition]);
            if (setPaymentId) setPaymentId(response.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset((payment as FormType) || {});
        await invalidateQueries([ResourceType.Payment, ResourceType.PaymentPosition]);
    };

    const onProcess = async () => {
        if (payment) {
            await paymentsProcess(payment?.id, { version: payment.version });
            await invalidateQueries([ResourceType.Payment, ResourceType.PaymentPosition]);
        }
    };

    const onWithdraw = async () => {
        if (payment) {
            await paymentsWithdraw(payment.id, { version: payment.version });
            await invalidateQueries([ResourceType.Payment, ResourceType.PaymentPosition]);
        }
    };

    return { control, isDirty, handleSubmit, onSubmit, onCancel, onProcess, onWithdraw };
}
