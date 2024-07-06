import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
    embedded?: boolean;
};

export default function AccountantFeatures({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const featureList = useMemo(
        () => [
            t(`accountantDetailFeature1`),
            t(`accountantDetailFeature2`),
            t(`accountantDetailFeature3`),
            t(`accountantDetailFeature4`),
            t(`accountantDetailFeature5`),
            t(`accountantDetailFeature6`),
        ],
        [t],
    );

    return (
        <Box
            sx={{
                minHeight: 0,
            }}
        >
            {!embedded && (
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 0 }}>
                    <IconButton
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
            <Box sx={embedded ? { minHeight: 0 } : { p: 1, minHeight: 0 }}>
                <ul>
                    {featureList.map((item, index) => (
                        <li key={index}>
                            <Typography color={'text.secondary'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
}
