import DocDate from '@/components/DocDate';
import DocNumber from '@/components/DocNumber';
import DocPaymentStatus from '@/components/DocPaymentStatus';
import { FormNumberField } from '@/components/form/FormNumberField';
import Toolbar from '@/components/layout/Toolbar';
import SelectAccPeriod from '@/components/SelectAccPeriod';
import { SelectPaymentType } from '@/components/SelectPaymentType';
import useLocale from '@/hooks/useLocale';
import { Grid } from '@mui/material';
import { Company, Payment, PaymentGroup, PaymentStatus } from '@repo/openapi';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import usePaymentDetails from '../hooks/usePaymentDetails';
import useTransformPayment from '../hooks/useTransformPayment';

type Props = {
    company: Company;
    payPeriod: Date;
    payment?: Payment | undefined;
    setPaymentId?: (paymentId: number) => void;
};

export function PaymentDetails(props: Props) {
    const { company, payPeriod, setPaymentId } = props;
    const payment = useTransformPayment(props.payment);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { control, isDirty, handleSubmit, onSubmit, onCancel, onProcess, onWithdraw } =
        usePaymentDetails({
            payment,
            company,
            payPeriod,
            setPaymentId,
        });

    useEffect(() => {}, [locale]);

    return (
        <>
            <Toolbar
                onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty ? onCancel : 'disabled'}
                onProcess={payment?.status === PaymentStatus.Draft ? onProcess : 'disabled'}
                onWithdraw={payment?.status !== PaymentStatus.Draft ? onWithdraw : 'disabled'}
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
                            <DocNumber disabled={!!payment?.id} control={control} />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <DocDate disabled={!!payment?.id} control={control} />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <DocPaymentStatus
                                disabled={!!payment?.id}
                                control={control}
                                status={payment?.status || PaymentStatus.Draft}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} lg={6}>
                            <SelectPaymentType
                                disabled={!!payment?.id}
                                autoFocus
                                control={control}
                                filter={{ groups: [PaymentGroup.Payments] }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6}>
                            <SelectAccPeriod
                                disabled={!!payment?.id}
                                control={control}
                                companyId={Number(company?.id)}
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
                                    payment?.status === PaymentStatus.Paid
                                        ? PaymentStatus.Paid
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
    );
}
