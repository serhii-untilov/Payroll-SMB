import { selectThemeMode } from '@/store/slices/themeModeSlice';
import { useAppSelector } from '@/store/store.hooks';
import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FeaturesAccountant from './FeaturesAccountant';
import FeaturesAdministrator from './FeaturesAdministrator';
import FeaturesEmployee from './FeaturesEmployee';

export default function useFeatures() {
    const themeMode = useAppSelector(selectThemeMode);
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

    const featuresAccountant = useMemo(
        () => [
            t(`accountantDetailFeature1`),
            t(`accountantDetailFeature2`),
            t(`accountantDetailFeature3`),
            t(`accountantDetailFeature4`),
            t(`accountantDetailFeature5`),
            t(`accountantDetailFeature6`),
        ],
        [t],
    );

    const featuresAdministrator = useMemo(
        () => [
            t('administratorDetailFeatures1'),
            t('administratorDetailFeatures2'),
            t('administratorDetailFeatures3'),
            t('administratorDetailFeatures4'),
            t('administratorDetailFeatures5'),
        ],
        [t],
    );

    const featuresEmployee = useMemo(
        () => [
            t('employeeDetailFeature1'),
            t('employeeDetailFeature2'),
            t('employeeDetailFeature3'),
            t('employeeDetailFeature4'),
            t('employeeDetailFeature5'),
            t('employeeDetailFeature6'),
            t('employeeDetailFeature7'),
        ],
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
                roleFeatures: <FeaturesAccountant isEmbedded={true} />,
                details: '/accountant-features',
            },
            {
                name: t('Employee'),
                description: [t(`employeeFeature1`), t(`employeeFeature2`)],
                icon: <PeopleOutlined color="primary" />,
                roleFeatures: <FeaturesEmployee isEmbedded={true} />,
                details: '/employee-features',
            },
            {
                name: t('Administrator'),
                description: [t('administratorFeature1'), t('administratorFeature2')],
                icon: <Settings color="primary" />,
                roleFeatures: <FeaturesAdministrator isEmbedded={true} />,
                details: '/administrator-features',
            },
        ],
        [t, themeMode],
    );

    return {
        mainFeatures,
        featuresByRoles,
        selectedIndex,
        setSelectedIndex,
        featuresAccountant,
        featuresAdministrator,
        featuresEmployee,
    };
}
