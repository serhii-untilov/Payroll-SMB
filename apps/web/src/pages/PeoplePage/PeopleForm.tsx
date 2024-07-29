import { InputLabel } from '@/components/layout/InputLabel';
import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { TabsContainer } from '@/components/layout/TabsContainer';
import SelectPayPeriod from '@/components/SelectPayPeriod';
import useLocale from '@/hooks/context/useLocale';
import { Box, Grid } from '@mui/material';
import { Company } from '@repo/openapi';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useTabs from './hooks/usePeopleFormTabs';

type PeopleFormProps = {
    company: Company;
    payPeriod: Date;
    tabIndex: string | null;
    goBack: boolean;
};

export default function PeopleForm(props: PeopleFormProps) {
    const { company, payPeriod, tabIndex, goBack } = props;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const tabs = useTabs(company.id, payPeriod);

    useEffect(() => {}, [locale]);

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
}
