import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureBox } from './FeatureBox';
import { UseCases } from './UseCases';
import AccountantFeatures from './featuresByRole/AccountantFeatures';
import AdministratorFeatures from './featuresByRole/AdministratorFeatures';
import EmployeeFeatures from './featuresByRole/EmployeeFeatures';
import useAppContext from '../../../hooks/useAppContext';

export function Features() {
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

    return (
        <Box
            id="features"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                id="features__main-features"
                sx={{
                    flex: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    alignItems: 'center',
                    gap: 0,
                }}
            >
                <Typography variant="h1" sx={{ textAlign: 'center' }}>
                    {t('Main features')}
                </Typography>
                <Typography color="text.secondary">
                    <ul>
                        {mainFeatures.map((item) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </Typography>
            </Box>

            <Box id="features-by-roles" sx={{ display: 'flex', gap: 2 }}>
                <Box
                    id="features-by-roles__left-side"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 4 }}
                >
                    {featuresByRoles.map((item, index) => (
                        <FeatureBox
                            name={item.name}
                            description={item.description}
                            icon={item.icon}
                            selectedIndex={selectedIndex}
                            index={index}
                            onClick={(index) => setSelectedIndex(index)}
                            details={item.details}
                        ></FeatureBox>
                    ))}
                </Box>
                <Box
                    id="features-by-roles__right-side"
                    sx={{
                        flex: 5,
                        display: { xs: 'none', sm: 'none', md: 'flex' },
                        flexDirection: 'column',
                        height: '100%',
                        borderRadius: 3,
                        p: 2,
                        // From https://css.glass
                        bgcolor: (theme) =>
                            theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        webkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        minHeight: 380,
                        overflow: 'auto',
                    }}
                >
                    {featuresByRoles[selectedIndex].roleFeatures}
                </Box>
            </Box>
            <UseCases />
        </Box>
    );
}
