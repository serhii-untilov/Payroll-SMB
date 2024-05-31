import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';

export function UseCases() {
    const useCases = useMemo(
        () => [
            {
                name: 'Корпоративна структура',
                description: [
                    `Централізований облік підприємств з єдиною нормативно-довідковою системою.`,
                    `Адміністратор або група адміністраторів підтримують у актуальному стані локальні довідники загального призначення.`,
                    `Оновлення довідників, що містять норми законодавства виконується автоматично.`,
                    `У такому разі доступ користувачів до довідників обмежена режимом 'тільки читання'.`,
                    `Адміністрування системи можуть виконувати працівники організації або спеціалісти супроводження.`,
                ],
                image: 'corporate-system-uk.png',
            },
            {
                name: 'Незалежні підприємства',
                description: [
                    `Централізований облік незалежних підприємств з ізольованою нормативно-довідковою системою.`,
                    `В цьому сценарії адміністратор частково або повністю передає бухгалтеру або групі бухгалтерів підтримку локальних довідників.`,
                    `Ізольовані довідники наповнюються окремо для кожного підприємства.`,
                    `Оновлення довідників, що містять норми законодавства виконується автоматично.`,
                    `Адміністрування системи може виконувати працівник сервісної організації або спеціалісти супроводження.`,
                ],
                image: 'isolated-system-uk.png',
            },
            {
                name: 'Одне підприємство',
                description: [
                    `Облік заробітної плати для одного підприємства.`,
                    `Установка системи виконується на сервер підприємства самостійно або із залученням спеціаліста.`,
                    `Оновлення довідників, що містять норми законодавства виконується автоматично. Локальні довідники наповнюють користувачі.`,
                    `В цьому сценарії також можлива настройка прав доступу одного користувача до усіх функцій системи або розподіл функцій між групою користувачів.`,
                    `Адміністративні функції може виконувати сам користувач, один чи кілька користувачів групи або спеціаліст супроводження.`,
                ],
                image: 'single-system-uk.png',
            },
        ],
        [],
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', my: 5, gap: 2 }}>
            <Typography variant="h2" color={'text.primary'} sx={{ my: 3, textAlign: 'center' }}>
                Сценарії використання
            </Typography>
            {useCases.map((item, index) => {
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection:
                                index % 2
                                    ? { xs: 'column', md: 'row-reverse' }
                                    : { xs: 'column', md: 'row' },
                            gap: { xs: 2, md: 6 },
                            // border: '1px solid gray',
                            borderRadius: 3,
                            py: 3,
                            px: 6,
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 4,
                                height: '100%',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Typography variant="h3" color="primary">
                                {item.name}
                            </Typography>
                            {item.description.map((element) => {
                                return <Typography>{element}</Typography>;
                            })}
                        </Box>
                        <Box
                            id="use-case__image"
                            component="img"
                            sx={{
                                flex: 3,
                                width: '100%',
                                height: 'auto',
                                mx: ['auto'],
                                // borderRadius: 2,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                // backgroundColor: 'grey',
                                borderRadius: 2,
                                p: 2,
                                minHeight: 0,
                                maxWidth: 400,
                            }}
                            alt="Use case image"
                            src={item.image}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}
