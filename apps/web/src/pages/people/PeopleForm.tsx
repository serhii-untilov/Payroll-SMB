import { InputLabel } from '@/components/layout/InputLabel';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import { Box, Grid } from '@mui/material';
import { Company, PayPeriod } from '@repo/openapi';
import { useTranslation } from 'react-i18next';
import usePeopleForm from './PeopleForm.hooks';

export type PeopleFormProps = {
    company: Company;
    payPeriod: PayPeriod;
    tabIndex: string | null;
    goBack: boolean;
};

const PeopleForm = (props: PeopleFormProps) => {
    const { company, tabIndex, goBack } = props;
    const { t } = useTranslation();
    const { tabs } = usePeopleForm(props);

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{t('People')}</PageTitle>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8} md={6} lg={3} sx={{ mb: 1 }}>
                    <InputLabel>{t('Pay Period')}</InputLabel>
                    <SelectPayPeriod companyId={company?.id} sx={{ fontWeight: 'bold' }} />
                </Grid>
            </Grid>
            <Box
                id="people__tabs-box"
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                }}
            >
                <TabsContainer id="people-form-tabs" tabIndex={tabIndex} tabs={tabs} />
            </Box>
        </PageLayout>
    );
};

export default PeopleForm;
