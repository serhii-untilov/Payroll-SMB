import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useFeatures from './Features.hooks';
import PageTitle from '@/components/layout/PageTitle';

const FeaturesEmployee = ({ isEmbedded }) => {
    const { t } = useTranslation();
    const { featuresEmployee } = useFeatures();

    return (
        <>
            {!isEmbedded && <PageTitle title={t('Employee')} goBack={true} hideAppState={true} />}
            <Box sx={isEmbedded ? {} : { p: 1 }}>
                <ul>
                    {featuresEmployee.map((item, index) => (
                        <li key={index}>
                            <Typography color={'text.secondary'}>{item}</Typography>
                        </li>
                    ))}
                </ul>
            </Box>
        </>
    );
};

export default FeaturesEmployee;
