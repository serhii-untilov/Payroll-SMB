import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import UseCaseList from '../use-cases/UseCaseList';
import useFeatures from './Features.hooks';
import FeaturesRoleList from './FeaturesRoleList';

const FeaturesSection = () => {
    const { t } = useTranslation();
    const { mainFeatures } = useFeatures();

    return (
        <Box
            id="features"
            sx={{
                maxWidth: 'lg',
                width: '100%',
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Box
                id="features__main-features"
                sx={{
                    flex: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    alignItems: 'center',
                    gap: 0,
                }}
            >
                <Typography variant="h1" sx={{ textAlign: 'center' }}>
                    {t('Main features')}
                </Typography>
                <Box color="text.secondary">
                    <ul>
                        {mainFeatures.map((item, index) => (
                            <li key={index + 1}>{item}</li>
                        ))}
                    </ul>
                </Box>
            </Box>

            <FeaturesRoleList />
            <UseCaseList />
        </Box>
    );
};

export default FeaturesSection;
