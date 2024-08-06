import { Box, Typography } from '@mui/material';
import PageTitle from '@/components/layout/PageTitle';
import { useTranslation } from 'react-i18next';
import useFeatures from './Features.hooks';

const FeaturesAdministrator = ({ isEmbedded }) => {
    const { t } = useTranslation();
    const { featuresAdministrator } = useFeatures();
    return (
        <>
            {!isEmbedded && (
                <PageTitle title={t('Administrator')} goBack={true} hideAppState={true} />
            )}
            <Box sx={isEmbedded ? {} : { p: 1 }}>
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
};

export default FeaturesAdministrator;
