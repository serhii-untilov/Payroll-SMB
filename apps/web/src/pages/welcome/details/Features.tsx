import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureBox } from './FeatureBox';
import { AccountantFeatures } from './featuresByRole/AccountantFeatures';
import { AdministratorFeatures } from './featuresByRole/AdministratorFeatures';
import { EmployeeFeatures } from './featuresByRole/EmployeeFeatures';

type Props = { wideScreen: boolean };

export function Features({ wideScreen }: Props) {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState(
        Number(localStorage.getItem('feature-index')),
    );

    useEffect(() => {
        localStorage.setItem('feature-index', selectedIndex.toString());
    }, [selectedIndex]);

    const mainFeatures = useMemo(
        () => [
            'Нарахування заробітної плати для підприємств малого та середнього бізнесу.',
            'Автоматизоване створення розрахункових документів та звітів згідно з розкладом бізнес-процесів.',
            'Корпоративний або ізольований метод обліку для множини підприємств у централізованій базі даних.',
            'Рольова модель доступу користувачів.',
        ],
        [],
    );

    const featuresByRoles = useMemo(
        () => [
            {
                name: t('Accountant'),
                description: [
                    'Створення підприємств, створення вакансій.',
                    'Призначення та звільнення працівників.',
                    'Табельний облік, виплата зарплати.',
                ],
                icon: <BusinessCenterOutlined color="primary" />,
                roleFeatures: <AccountantFeatures />,
            },
            {
                name: t('Employee'),
                description: [
                    `Перегляд особової картки та розрахункових листів.`,
                    `Створення заяв про відпустку або звільнення.`,
                    `Отримання довідок з місця роботи та заробіток.`,
                ],
                icon: <PeopleOutlined color="primary" />,
                roleFeatures: <EmployeeFeatures />,
            },
            {
                name: t('Administrator'),
                description: [
                    'Призначення прав доступу ролям користувачів.',
                    'Розподіл функцій обліку між користувачами.',
                    'Централізоване оновлення загальних довідників.',
                ],
                icon: <Settings color="primary" />,
                roleFeatures: <AdministratorFeatures />,
            },
        ],
        [t],
    );

    return (
        <Box
            id="features"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                // mt: 13,
                mb: 1,
                p: 1,
                display: 'flex',
                flex: 1,
                height: '100%',
                gap: 4,
            }}
        >
            <Box
                id="features__left-side"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    flex: 1,
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Typography variant="h1">{t('Main features')}</Typography>
                    <Typography color="grey.800">
                        <ul
                            style={{
                                padding: 0,
                                marginLeft: '1rem',
                            }}
                        >
                            {mainFeatures.map((item) => (
                                <li
                                    style={{
                                        // listStyleType: 'none'
                                        marginTop: '0.4rem',
                                        marginBottom: '0.4rem',
                                    }}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Typography>
                </Box>
                {featuresByRoles.map((feature, index) => (
                    <FeatureBox
                        name={feature.name}
                        description={feature.description}
                        icon={feature.icon}
                        selectedIndex={selectedIndex}
                        index={index}
                        onClick={(index) => setSelectedIndex(index)}
                    ></FeatureBox>
                ))}
            </Box>
            <Box
                id="features__right-side"
                sx={{
                    // display: { sm: 'none', md: '' },
                    display: { xs: 'none', sm: 'none', md: 'block' },
                    height: '100%',
                    flex: 1,
                    borderRadius: 3,
                    p: 2,
                    /* From https://css.glass */
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    webkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                {featuresByRoles[selectedIndex].roleFeatures}
            </Box>
        </Box>
    );
}
