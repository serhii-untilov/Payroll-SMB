import { InputLabel } from '@/components/layout/InputLabel';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Box, Grid } from '@mui/material';
import { Company, PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import useTimeShiftForm from './TimeShiftForm.hooks';

export type TimeShiftFormProps = {
    company: Company;
    payPeriod: PayPeriod;
    tabIndex: string | null;
    goBack: boolean;
};

const TimeShiftForm = (props: TimeShiftFormProps) => {
    const { company, tabIndex, goBack } = props;
    const { t } = useTranslation();
    const { tabs } = useTimeShiftForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{t('TimeShift')}</PageTitle>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                    <InputLabel>{t('Pay Period')}</InputLabel>
                    <SelectPayPeriod companyId={company?.id} sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>
            <Box
                id="timeShift__tabs-box"
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <TabsContainer id="timeShift-form-tabs" tabIndex={tabIndex} tabs={tabs} />
            </Box>
        </PageLayout>
    );
};

export default TimeShiftForm;
