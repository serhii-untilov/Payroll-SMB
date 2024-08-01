import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
// import image from '/screenshot-administrator-role.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFeatures } from '../hooks/Features.hooks';

type Props = {
    embedded?: boolean;
};

export default function FeaturesAdministrator({ embedded }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { featuresAdministrator } = useFeatures();

    return (
        <>
            {!embedded && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        {t('Administrator')}
                    </Typography>
                </Box>
            )}
            <Box sx={embedded ? {} : { p: 1 }}>
                <ul>
                    {featuresAdministrator.map((item, index) => (
                        <li key={index}>
                            <Typography color={'text.secondary'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </>
    );
}
