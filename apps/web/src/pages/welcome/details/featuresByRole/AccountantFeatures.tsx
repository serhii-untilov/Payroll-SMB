import { Box, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import image from '/screenshot-accountant-role.png';
import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
    embedded?: boolean;
};

export default function AccountantFeatures({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
        <Box sx={{ minHeight: 0 }}>
            {!embedded && (
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <IconButton
                        aria-label="Go Back"
                        color="primary"
                        sx={{ mr: 1 }}
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        <ArrowBackIosNewRounded />
                    </IconButton>
                    <Typography component="h2" color="primary.main" variant="h2" noWrap>
                        {t('Accountant')}
                    </Typography>
                </Box>
            )}
            {/* {embedded && (
                <Box
                    component="img"
                    sx={{
                        width: '100%',
                        height: 'auto',
                        mx: ['auto'],
                        borderRadius: 2,
                        border: '2px solid white',
                        minHeight: 0,
                    }}
                    alt="Screenshot"
                    src={image}
                />
            )} */}
            <Box sx={embedded ? { minHeight: 0 } : { p: 1, minHeight: 0 }}>
                <ul>
                    {featureList.map((item) => (
                        <li>
                            <Typography color={'grey.800'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
}
