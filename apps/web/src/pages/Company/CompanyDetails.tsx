import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components/layout/TabPanel';
import { CompanyDepartments } from './CompanyDepartments';
import { CompanyManagers } from './CompanyManagers';
import { CompanyAccounts } from './CompanyAccounts';

export type CompanyDetailsProps = {
    companyId: number;
};

export default function CompanyDetails(props: CompanyDetailsProps) {
    const { companyId } = props;
    const [value, setValue] = React.useState(0);
    const { t } = useTranslation();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            <Box
            // sx={{ borderBottom: 0.5, borderColor: 'divider' }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // textColor={'inherit'}
                    // indicatorColor="primary"
                >
                    <Tab label={t('Departments')} />
                    <Tab label={t('Managers')} />
                    <Tab label={t('Accounts')} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0} sx={{ flex: 1 }}>
                <CompanyDepartments companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={1} sx={{ flex: 1 }}>
                <CompanyManagers companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={2} sx={{ flex: 1 }}>
                <CompanyAccounts companyId={companyId} />
            </TabPanel>
        </Box>
    );
}
