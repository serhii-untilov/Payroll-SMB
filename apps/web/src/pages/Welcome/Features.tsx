import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FeatureBox } from './details/FeatureBox';
import { UseCases } from './details/UseCases';
import { useFeatures } from './Features.hooks';

export function Features() {
    const { t } = useTranslation();
    const { mainFeatures, featuresByRoles, selectedIndex, setSelectedIndex } = useFeatures();

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

            <Box id="features-by-roles" sx={{ display: 'flex', gap: 2 }}>
                <Box
                    id="features-by-roles__left-side"
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 4 }}
                >
                    {featuresByRoles.map((item, index) => (
                        <FeatureBox
                            key={index}
                            name={item.name}
                            description={item.description}
                            icon={item.icon}
                            selectedIndex={selectedIndex}
                            index={index}
                            onClick={(index) => setSelectedIndex(index)}
                            details={item.details}
                        ></FeatureBox>
                    ))}
                </Box>
                <Box
                    id="features-by-roles__right-side"
                    sx={{
                        flex: 5,
                        display: { xs: 'none', sm: 'none', md: 'flex' },
                        flexDirection: 'column',
                        height: '100%',
                        borderRadius: 3,
                        p: 2,
                        // From https://css.glass
                        bgcolor: (theme) =>
                            theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        webkitBackdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        minHeight: 380,
                        overflow: 'auto',
                    }}
                >
                    {featuresByRoles[selectedIndex].roleFeatures}
                </Box>
            </Box>
            <UseCases />
        </Box>
    );
}
