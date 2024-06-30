import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import { IPayment, PaymentGroup } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { FormTextField } from '../../components/form/FormTextField';
import { Toolbar } from '../../components/layout/Toolbar';
import { createPayment, getPayment, updatePayment } from '../../services/payment.service';
import { getDirtyValues } from '../../services/utils';
import { InputLabel } from '../../components/layout/InputLabel';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { SelectPayPeriod } from '../../components/select/SelectPayPeriod';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { EmployeePayments } from './details/EmployeePayments';
import { MandatoryPayments } from './details/MandatoryPayments';
import { SelectPaymentType } from '../../components/select/SelectPaymentType';
import { PaymentDetails } from './details/PaymentDetails';

export default function PaymentForm() {
    const { id } = useParams();
    const [paymentId, setPaymentId] = useState<number>(Number(id));
    const { company, payPeriod } = useAppContext();
    const { locale } = useLocale();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const tabName = searchParams.get('tab');
    const goBack = true;
    const [tab, setTab] = useState(
        Number(tabName ? getTabIndex(tabName) : localStorage.getItem('payment-tab-index')),
    );
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
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('payment-tab-index', newValue.toString());
    };

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
            <PageLayout>
                <PageTitle goBack={goBack}>
                    {payment?.id ? payment?.paymentType?.name : t('New Payment')}
                </PageTitle>

                <Box
                    id="payments__tabs-box"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <Tabs id="payments__tabs" value={tab} onChange={handleTabChange}>
                        <Tab label={t('Payment Details')} />
                        <Tab label={t('Employees')} />
                        <Tab label={t('Mandatory Payments')} />
                    </Tabs>
                    <TabPanel value={tab} index={0}>
                        <PaymentDetails paymentId={paymentId} setPaymentId={setPaymentId} />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <EmployeePayments paymentId={paymentId} />
                    </TabPanel>
                    <TabPanel value={tab} index={2}>
                        <MandatoryPayments paymentId={paymentId} />
                    </TabPanel>
                </Box>
            </PageLayout>
        )
    );
}

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    const map = { employeePayments: 0, mandatoryPayments: 1 };
    return map[tabName];
}
