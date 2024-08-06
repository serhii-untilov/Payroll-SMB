import { InputLabel } from '@/components/layout/InputLabel';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Box, Grid } from '@mui/material';
import { Company, PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import usePayrollForm from './PayrollForm.hooks';

export type PayrollFormProps = {
    company: Company;
    payPeriod: PayPeriod;
    tabIndex: string | null;
    goBack: boolean;
};

const PayrollForm = (props: PayrollFormProps) => {
    const { t } = useTranslation();
    const { tabs } = usePayrollForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={props.goBack}>{t('Salary Report')}</PageTitle>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                    <InputLabel>{t('Pay Period')}</InputLabel>
                    <SelectPayPeriod companyId={props.company.id} sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <TabsContainer id="payroll-form-tabs" tabIndex={props.tabIndex} tabs={tabs} />
            </Box>
        </PageLayout>
    );
};

export default PayrollForm;
