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
            t('administratorDetailFeatures1'),
            t('administratorDetailFeatures2'),
            t('administratorDetailFeatures3'),
            t('administratorDetailFeatures4'),
            t('administratorDetailFeatures5'),
        ],
        [t],
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
