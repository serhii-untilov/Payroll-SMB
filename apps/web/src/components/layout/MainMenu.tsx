import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
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
import { ListItemLink } from './ListItemLink';

export function MainMenu() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();

    useEffect(() => {}, [company, locale]);

    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemLink to="/dashboard" primary={t('Dashboard')} icon={<DashboardOutlined />} />
            <ListItemLink
                to={`/company/${company?.id || ''}`}
                primary={t('Company')}
                icon={<BusinessCenterOutlined />}
            />

            {company && (
                <ListItemLink to="/people" primary={t('People')} icon={<PeopleOutlined />} />
            )}
            {company && (
                <ListItemLink to="/time-sheet" primary={t('Time Sheet')} icon={<Schedule />} />
            )}
            {company && (
                <ListItemLink
                    to="/payroll"
                    primary={t('Salary Report')}
                    icon={<CalculateOutlined />}
                />
            )}
            {company && (
                <ListItemLink to="/payments" primary={t('Payments')} icon={<CreditScore />} />
            )}
            {company && <ListItemLink to="/reports" primary={t('Reports')} icon={<Equalizer />} />}
        </List>
    );
}
