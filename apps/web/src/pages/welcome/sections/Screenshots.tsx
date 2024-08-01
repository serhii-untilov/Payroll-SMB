import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useScreenshotList } from '../hooks/Screenshots.hooks';

export function ScreenshotList() {
    const { t } = useTranslation();
    const { image, onNextImage, onPriorImage } = useScreenshotList();

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
                    src={image}
                />
                <ButtonGroup variant="text" sx={{ m: 1, p: 1 }}>
                    <Button
                        startIcon={<KeyboardArrowLeftRounded />}
                        onClick={onPriorImage}
                    ></Button>
                    <Button endIcon={<KeyboardArrowRightRounded />} onClick={onNextImage}></Button>
                </ButtonGroup>
            </Box>
        </Box>
    );
}
