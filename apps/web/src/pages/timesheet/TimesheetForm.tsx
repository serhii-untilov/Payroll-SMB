import { InputLabel } from '@/components/layout/InputLabel';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Box, Grid } from '@mui/material';
import { Company, PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import { useTimesheetForm } from './TimesheetForm.hooks';

export type TimesheetFormProps = {
    company: Company;
    payPeriod: PayPeriod;
    tabIndex: string | null;
    goBack: boolean;
};

const TimesheetForm = (props: TimesheetFormProps) => {
    const { company, tabIndex, goBack } = props;
    const { t } = useTranslation();
    const { tabs } = useTimesheetForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{t('Timesheet')}</PageTitle>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                    <InputLabel>{t('Pay Period')}</InputLabel>
                    <SelectPayPeriod companyId={company?.id} sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>
            <Box
                id="timesheet__tabs-box"
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <TabsContainer id="timesheet-form-tabs" tabIndex={tabIndex} tabs={tabs} />
            </Box>
        </PageLayout>
    );
};

export default TimesheetForm;
