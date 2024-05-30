import { Box, Typography } from '@mui/material';
import image from '/screenshot-accountant-role.png';
import { BoxProps } from '@mui/system';
import { useMemo } from 'react';

type Props = BoxProps;

export function AccountantFeatures(props: Props) {
    const featureList = useMemo(
        () => [
            `Створення підприємств, визначення параметрів розрахунку та обліку заробітної плати. Кількість підприємств не обмежена.`,
            `Створення підрозділів, вакансій, призначення працівників на посади та визначення Фонду оплати праці.`,
            `Розрахунок заробітної плати виконується автоматично після кожної події внесення змін у картки працівників або настройку.`,
            `Після розрахунку зарплати працівників автоматично виконується розрахунок нарахувань на заробітну плату, розрахунок проводок і зведеної відомості зарплати.`,
            `Повний результат розрахунку зарплати по підприємству завжди актуальний і не потребує спеціальних дій від бухгалтера.`,
            `Створення розрахункових документів та звітів, що мають періодичний характер виконується автоматично відповідно до розкладу бізнес-процесів.`,
        ],
        [],
    );

    return (
        <>
            <Box
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
            />
            <ul>
                {featureList.map((item) => (
                    <li>
                        <Typography color={'grey.800'}>{item}</Typography>
                    </li>
                ))}
            </ul>
        </>
    );
}
