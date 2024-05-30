import { Box, Typography } from '@mui/material';
import image from '/screenshot-employee-role.png';
import { BoxProps } from '@mui/system';
import { useMemo } from 'react';

type Props = BoxProps;

export function EmployeeFeatures(props: Props) {
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
