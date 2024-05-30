import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';

const imageList = [
    {
        img: '/screenshot-1.png',
        title: 'Employees',
    },
    {
        img: '/screenshot-2.png',
        title: 'Payroll',
    },
];

export function ScreenshotList() {
    const [index, setIndex] = useState(0);

    const onNextImage = () => {
        if (index + 1 < imageList.length) {
            setIndex(index + 1);
        }
    };

    const onPriorImage = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <>
            <Typography variant="h2" color={'text.primary'} sx={{ my: 3, textAlign: 'center' }}>
                Скріншоти
            </Typography>
            <Box
                id="screenshot-list"
                sx={{
                    maxWidth: 'lg',
                    width: '100%',
                    px: { xs: 1, sm: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'grey.50',
                    m: 1,
                    p: 2,
                    borderRadius: 3,
                    // From https://css.glass
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    webkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                <Box
                    id="screenshot-list__image"
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
                    src={imageList[index].img}
                />
                <ButtonGroup variant="text" sx={{ m: 1, p: 1 }}>
                    <Button
                        startIcon={<KeyboardArrowLeftRounded />}
                        onClick={() => {
                            onPriorImage();
                        }}
                    ></Button>
                    <Button
                        endIcon={<KeyboardArrowRightRounded />}
                        onClick={() => onNextImage()}
                    ></Button>
                </ButtonGroup>
            </Box>
        </>
    );
}
