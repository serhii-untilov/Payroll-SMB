import BusinessCenterOutlined from '@mui/icons-material/BusinessCenterOutlined';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import CreditScore from '@mui/icons-material/CreditScore';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import Equalizer from '@mui/icons-material/Equalizer';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Schedule from '@mui/icons-material/Schedule';
import List from '@mui/material/List';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';
import { ListItemLink } from './ListItemLink';

export function MainMenu() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemLink to="/dashboard" primary={t('Dashboard')} icon={<DashboardOutlined />} />
            <ListItemLink
                to={'/company/'}
                primary={t('Company')}
                icon={<BusinessCenterOutlined />}
            />
            <ListItemLink to="/people" primary={t('People')} icon={<PeopleOutlined />} />
            {/* <ListItemLink to="/time-off" primary={t('Time Off')} icon={<LandscapeOutlined />} /> */}
            <ListItemLink to="/time-sheet" primary={t('Time Sheet')} icon={<Schedule />} />
            <ListItemLink to="/payroll" primary={t('Payroll')} icon={<CalculateOutlined />} />
            <ListItemLink to="/payments" primary={t('Payments')} icon={<CreditScore />} />
            {/* <ListItemLink to="/pay-contractors" primary="Pay Contractors" icon={<Description />} /> */}
            {/* <ListItemLink to="/benefits" primary="Benefits" icon={<Description />} /> */}
            {/* <ListItemLink to="/compliant" primary="Stay Compliant" icon={<Description />} /> */}
            {/* <ListItemLink to="/surveys" primary="Surveys" icon={<Description />} /> */}
            <ListItemLink to="/reports" primary={t('Reports')} icon={<Equalizer />} />
            {/* <ListItemLink to="/reports" primary="Settings" icon={<Settings />} /> */}
        </List>
    );
}
