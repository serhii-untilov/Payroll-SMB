import Box from '@mui/material/Box';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components/layout/TabPanel';
import { DepartmentList } from './DepartmentList';
import { ManagerList } from './ManagerList';
import { AccountList } from './AccountList';
import { TabsHorizontal } from '../../components/layout/TabsHorizontal';
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
                <TabsHorizontal
                    value={value}
                    onChange={handleChange}
                    // textColor={'inherit'}
                    // indicatorColor="primary"
                >
                    <Tab label={t('Departments')} />
                    <Tab label={t('Managers')} />
                    <Tab label={t('Accounts')} />
                </TabsHorizontal>
            </Box>
            <TabPanel value={value} index={0} sx={{ flex: 1 }}>
                <DepartmentList companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={1} sx={{ flex: 1 }}>
                <ManagerList companyId={companyId} />
            </TabPanel>
            <TabPanel value={value} index={2} sx={{ flex: 1 }}>
                <AccountList companyId={companyId} />
            </TabPanel>
        </Box>
    );
}
