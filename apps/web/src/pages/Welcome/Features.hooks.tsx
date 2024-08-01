import useAppContext from '@/hooks/context/useAppContext';
import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountantFeatures from './details/featuresByRole/AccountantFeatures';
import AdministratorFeatures from './details/featuresByRole/AdministratorFeatures';
import EmployeeFeatures from './details/featuresByRole/EmployeeFeatures';

export function useFeatures() {
    const { themeMode } = useAppContext();
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(
        Number(localStorage.getItem('feature-index')),
    );

    useEffect(() => {
        localStorage.setItem('feature-index', selectedIndex.toString());
    }, [selectedIndex]);

    const mainFeatures = useMemo(
        () => [t('mainFeatures1'), t('mainFeatures2'), t('mainFeatures3'), t('mainFeatures4')],
        [t],
    );

    const featuresByRoles = useMemo(
        () => [
            {
                name: t('Accountant'),
                description: [t('accountantFeature1'), t('accountantFeature2')],
                icon: (
                    <BusinessCenterOutlined color={themeMode === 'light' ? 'primary' : 'primary'} />
                ),
                roleFeatures: <AccountantFeatures embedded={true} />,
                details: '/accountant-features',
            },
            {
                name: t('Employee'),
                description: [t(`employeeFeature1`), t(`employeeFeature2`)],
                icon: <PeopleOutlined color="primary" />,
                roleFeatures: <EmployeeFeatures embedded={true} />,
                details: '/employee-features',
            },
            {
                name: t('Administrator'),
                description: [t('administratorFeature1'), t('administratorFeature2')],
                icon: <Settings color="primary" />,
                roleFeatures: <AdministratorFeatures embedded={true} />,
                details: '/administrator-features',
            },
        ],
        [t, themeMode],
    );

    return { mainFeatures, featuresByRoles, selectedIndex, setSelectedIndex };
}
