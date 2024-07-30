import useLocale from '@/hooks/context/useLocale';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ScreenshotList() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [index, setIndex] = useState(0);

    useEffect(() => {}, [t]);

    const imageList = useMemo(
        () => [
            {
                img: locale.language === 'uk' ? '/screenshot-4-uk.png' : '/screenshot-4-en.png',
                title: t('Dashboard'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-1-uk.png' : '/screenshot-1-en.png',
                title: t('Employees'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-2-uk.png' : '/screenshot-2-en.png',
                title: t('Payroll'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-5-uk.png' : '/screenshot-5-en.png',
                title: t('Personal Card'),
            },
        ],
        [t, locale],
    );

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
        <Box id="screenshot-list">
            <Typography variant="h2" color={'text.primary'} sx={{ my: 3, textAlign: 'center' }}>
                {t('Screenshots')}
            </Typography>
            <Box
                sx={{
                    maxWidth: 'lg',
                    width: '100%',
                    px: { xs: 1, sm: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // bgcolor: 'grey.50',
                    m: 1,
                    p: 2,
                    borderRadius: 3,
                    // From https://css.glass
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)',
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
                        objectFit: 'contain',
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
        </Box>
    );
}
