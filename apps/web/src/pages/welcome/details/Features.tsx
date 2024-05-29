import { BusinessCenterOutlined, PeopleOutlined, Settings } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureBox } from './FeatureBox';

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
            'Автоматизоване створення розрахункових документів згідно з розкладом бізнес-процесів',
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
                    'Створення підприємств, створення вакансій.',
                    'Призначення та звільнення працівників.',
                    'Табельний облік, виплата зарплати.',
                ],
                icon: <BusinessCenterOutlined color="primary" />,
            },
            {
                name: t('Employee'),
                description: [
                    `Перегляд особової картки та розрахункових листів. Створення заяв про відпустку або звільнення. Повідомлення про хворобу.`,
                ],
                icon: <PeopleOutlined color="primary" />,
            },
            {
                name: t('Administrator'),
                description: [
                    'Розподіл прав доступу між ролями користувачів.',
                    'Розподіл функцій між користувачами за допомогою ролей.',
                    'Централізоване оновлення загальних довідників.',
                ],
                icon: <Settings color="primary" />,
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
                my: 1,
                p: 1,
                display: 'flex',
                flex: 1,
                height: '100%',
                gap: 4,
            }}
        >
            <Box
                id="features-left"
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
                        gap: 2,
                    }}
                >
                    <Typography variant="h1">{t('Main features')}</Typography>
                    <Typography color="grey.700">
                        <ul>
                            {mainFeatures.map((item) => (
                                <li>{item}</li>
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
            {wideScreen && (
                <Box
                    id="features-right"
                    sx={{
                        height: '100%',
                        flex: 1,
                        border: 1,
                        borderRadius: 3,
                        p: 1,
                        borderColor: 'grey.300',
                        bgcolor: 'grey.50',
                    }}
                >
                    <Box>Description</Box>
                </Box>
            )}
        </Box>
    );
}
