import { Box, Typography } from '@mui/material';
// import image from '/screenshot-administrator-role.png';
import { BoxProps } from '@mui/system';
import { useMemo } from 'react';

type Props = BoxProps;

export function AdministratorFeatures(props: Props) {
    const featureList = useMemo(
        () => [
            `Створення переліку ролей користувачів відповідно до розподілу задач між учасниками обліку.`,
            `По замовчуванню користувачам призначаються ролі за стандартними типами: 'Адміністратор', 'Бухгалтер', 'Працівник', в залежності від способу реєстрації користувача.`,
            `Ролі, створені у системі по замовчуванню, їх функції та параметри доступу можуть бути перевизначені Адміністратором у відповідності до сценарію використання системи.`,
        ],
        [],
    );

    const useCases = useMemo(
        () => [
            `Корпоративна структура - облік підприємств з єдиною нормативно-довідковою системою. Адміністратор або група адміністраторів підтримують у актуальному стані локальні довідники загального призначення. У такому разі доступ користувачів до довідників обмежена режимом 'тільки читання'.`,
            `Централізоване обслуговування множини незалежних підприємств - облік підприємств з ізольованою нормативно-довідковою системою. В цьому сценарії адміністратор частково або повністю передає бухгалтеру або групі бухгалтерів підтримку локальних довідників. Ізольовані довідники наповнюються окремо для кожного підприємства.`,
        ],
        [],
    );

    return (
        <>
            {/* <Box
                component="img"
                sx={{
                    width: '100%',
                    height: 'auto',
                    mx: ['auto'],
                    borderRadius: 2,
                    border: '2px solid white',
                }}
                alt="Screenshot"
                src={image}
                {...props}
            /> */}
            <Box component="div" sx={{ overflow: 'auto' }}>
                <Typography color={'text.primary'}>
                    Роль Адміністратора - визначальна і надає можливість організації роботи
                    користувачів у середовищах корпоративного або ізольованого обліку заробітної
                    плати для множини підприємств у централізованій базі даних.
                </Typography>
                <Typography variant="h6" color={'text.primary'} sx={{ my: 1 }}>
                    Сценарії організації роботи:
                </Typography>
                <ul>
                    {useCases.map((item) => (
                        <li>
                            <Typography color={'grey.800'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
                <Typography variant="h6" color={'text.primary'} sx={{ my: 1 }}>
                    Основні задачі Адміністратора:
                </Typography>
                <ul>
                    {featureList.map((item) => (
                        <li>
                            <Typography color={'grey.800'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
                <Typography color={'text.primary'}>
                    Примітка: законодавчі довідники оновлюються автоматично.
                </Typography>
            </Box>
        </>
    );
}
