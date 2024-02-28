import {
    CalculateOutlined,
    CreditScore,
    DashboardOutlined,
    Equalizer,
    PeopleOutlined,
    Schedule,
} from '@mui/icons-material';
import { List } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';
import { ListItemLink } from './ListItemLink';

import { CompanyListItem } from './CompanyMenu';

export function MainMenu() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemLink to="/dashboard" primary={t('Dashboard')} icon={<DashboardOutlined />} />
            <CompanyListItem />
            <ListItemLink to="/employees" primary={t('Employees')} icon={<PeopleOutlined />} />
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
