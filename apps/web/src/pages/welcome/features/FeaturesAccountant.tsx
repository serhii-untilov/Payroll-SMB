import PageTitle from '@/components/layout/PageTitle';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFeatures from './Features.hooks';

const FeaturesAccountant = ({ isEmbedded }) => {
    const { t } = useTranslation();
    const { featuresAccountant } = useFeatures();
    return (
        <Box sx={{ minHeight: 0 }}>
            {!isEmbedded && <PageTitle title={t('Accountant')} goBack={true} hideAppState={true} />}
            <Box sx={isEmbedded ? { minHeight: 0 } : { p: 1, minHeight: 0 }}>
                <ul>
                    {featuresAccountant.map((item, index) => (
                        <li key={index}>
                            <Typography color={'text.secondary'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
};

export default FeaturesAccountant;
