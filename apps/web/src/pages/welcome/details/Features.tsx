import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureBox } from './FeatureBox';
import AccountantFeatures from './featuresByRole/AccountantFeatures';
import AdministratorFeatures from './featuresByRole/AdministratorFeatures';
import EmployeeFeatures from './featuresByRole/EmployeeFeatures';
import { UseCases } from './UseCases';

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
            'Нарахування заробітної плати для підприємств малого та середнього бізнесу',
            'Автоматизоване створення розрахункових документів та звітів згідно з розкладом бізнес-процесів',
            'Корпоративний або ізольований метод обліку для множини підприємств у централізованій базі даних',
            'Рольова модель доступу користувачів',
        ],
        [],
    );

    const featuresByRoles = useMemo(
        () => [
            {
                name: t('Accountant'),
                description: [
                    'Створення вакансій, призначення працівників.',
                    'Табельний облік, виплата зарплати.',
                ],
                icon: <BusinessCenterOutlined color="primary" />,
                roleFeatures: <AccountantFeatures embedded={true} />,
                details: '/accountant-features',
            },
            {
                name: t('Employee'),
                description: [
                    `Перегляд особової картки та розрахункових листів.`,
                    `Створення заяв та отримання довідок.`,
                ],
                icon: <PeopleOutlined color="primary" />,
                roleFeatures: <EmployeeFeatures embedded={true} />,
                details: '/employee-features',
            },
            {
                name: t('Administrator'),
                description: [
                    'Призначення прав доступу користувачам.',
                    'Централізоване оновлення загальних довідників.',
                ],
                icon: <Settings color="primary" />,
                roleFeatures: <AdministratorFeatures embedded={true} />,
                details: '/administrator-features',
            },
        ],
        [t],
    );

    const useCases = useMemo(
        () => [
            `Корпоративна структура - облік підприємств з єдиною нормативно-довідковою системою. Адміністратор або група адміністраторів підтримують у актуальному стані локальні довідники загального призначення. У такому разі доступ користувачів до довідників обмежена режимом 'тільки читання'.`,
            `Централізоване обслуговування множини незалежних підприємств - облік підприємств з ізольованою нормативно-довідковою системою. В цьому сценарії адміністратор частково або повністю передає бухгалтеру або групі бухгалтерів підтримку локальних довідників. Ізольовані довідники наповнюються окремо для кожного підприємства.`,
        ],
        [],
    );

    return (
        <Box
            id="features"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                // mb: 1,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                // gap: 4,
                // fixed header
                // mt: 13,
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
                <Typography variant="h1">{t('Main features')}</Typography>
                <Typography color="grey.800">
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
                        background: 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        webkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        minHeight: 380,
                        // maxHeight: 380,
                        overflow: 'auto',
                    }}
                >
                    {featuresByRoles[selectedIndex].roleFeatures}
                </Box>
            </Box>
            {/* <Box
                id="features__use-cases"
                sx={{
                    flex: 0,
                    m: 2,
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    alignItems: 'center',
                    gap: 0,
                }}
            >
                <Typography variant="h2" color={'text.primary'} sx={{ my: 1 }}>
                    Сценарії організації роботи
                </Typography>
                <ul>
                    {useCases.map((item) => (
                        <li>
                            <Typography color={'grey.800'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box> */}
            <UseCases />
        </Box>
    );
}
