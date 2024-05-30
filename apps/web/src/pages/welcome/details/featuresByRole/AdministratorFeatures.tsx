import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
// import image from '/screenshot-administrator-role.png';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    embedded?: boolean;
};

export default function AdministratorFeatures({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const featureList = useMemo(
        () => [
            `Організація роботи користувачів у середовищах корпоративного або ізольованого обліку заробітної плати для множини підприємств у централізованій базі даних.`,
            `Створення переліку ролей користувачів відповідно до розподілу задач між учасниками обліку.`,
            `По замовчуванню користувачам призначаються ролі за стандартними типами: 'Адміністратор', 'Бухгалтер', 'Працівник', в залежності від способу реєстрації користувача.`,
            `Ролі, створені у системі по замовчуванню, їх функції та параметри доступу можуть бути перевизначені Адміністратором у відповідності до сценарію використання системи.`,
            `Оновлення загальних довідників. Довідники, що містять норми законодавства оновлюються автоматично.`,
        ],
        [],
    );

    return (
        <>
            {!embedded && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        {t('Administrator')}
                    </Typography>
                </Box>
            )}
            <Box sx={embedded ? {} : { p: 1 }}>
                <ul>
                    {featureList.map((item) => (
                        <li>
                            <Typography color={'grey.800'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </>
    );
}
