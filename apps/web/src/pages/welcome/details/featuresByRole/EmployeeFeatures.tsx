import { Box, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import image from '/screenshot-employee-role.png';
import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
    embedded?: boolean;
};

export default function EmployeeFeatures({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const featureList = useMemo(
        () => [
            `Перегляд персональної особової картки, історії призначень та змін умов оплати праці.`,
            `Перегляд та верифікація персональних даних, що містяться у картотеці підприємства.`,
            `Отримання залишку кількості днів відпустки, підсумків по дням відсутності за хворобою.`,
            `Створення заяв про надання відпустки або звільнення.`,
            `Повідомлення про відсутність за хворобою.`,
            `Перегляд розрахункових листів за поточний та попередні розрахункові періоди.`,
            `Отримання роз'яснення розрахунку за видами нарахувань та утримань та довідок про нараховану заробітну плату.`,
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
                        {t('Employee')}
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
                    }}
                    alt="Screenshot"
                    src={image}
                />
            )} */}
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
