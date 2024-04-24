import Box from '@mui/material/Box';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components/layout/TabPanel';
import { DepartmentList } from './DepartmentList';
import { ManagerList } from './ManagerList';
import { AccountList } from './AccountList';
import { Tabs } from '../../components/layout/Tabs';
import { Tab } from '../../components/layout/Tab';

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
            id="company__details_box"
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            {/* <Box
            // sx={{ borderBottom: 0.5, borderColor: 'divider' }}
            > */}
            <Tabs
                id="company__details_tabs"
                value={value}
                onChange={handleChange}
                // textColor={'inherit'}
                // indicatorColor="primary"
            >
                <Tab label={t('Departments')} />
                <Tab label={t('Managers')} />
                <Tab label={t('Accounts')} />
            </Tabs>
            {/* </Box> */}
            <TabPanel value={value} index={0}>
                <DepartmentList companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ManagerList companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AccountList companyId={companyId} />
            </TabPanel>
        </Box>
    );
}
