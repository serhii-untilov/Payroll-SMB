import useLocale from '@/hooks/useLocale';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function UseCases() {
    const { t } = useTranslation();
    const { locale } = useLocale();

    useEffect(() => {}, [t]);

    const useCases = useMemo(
        () => [
            {
                name: t('Corporate structure'),
                description: [
                    t('CorporateStructureDescription1'),
                    t('CorporateStructureDescription2'),
                    t('CorporateStructureDescription3'),
                    t('CorporateStructureDescription4'),
                    t('CorporateStructureDescription5'),
                ],
                image:
                    locale.language === 'uk'
                        ? 'corporate-system-uk.png'
                        : 'corporate-system-en.png',
            },
            {
                name: t('Independent enterprises'),
                description: [
                    t('IndependentEnterprisesDescription1'),
                    t('IndependentEnterprisesDescription2'),
                    t('IndependentEnterprisesDescription3'),
                    t('IndependentEnterprisesDescription4'),
                    t('IndependentEnterprisesDescription5'),
                ],
                image:
                    locale.language === 'uk' ? 'isolated-system-uk.png' : 'isolated-system-en.png',
            },
            {
                name: t('Single enterprise'),
                description: [
                    t('SingleEnterpriseDescription1'),
                    t('SingleEnterpriseDescription2'),
                    t('SingleEnterpriseDescription3'),
                    t('SingleEnterpriseDescription4'),
                    t('SingleEnterpriseDescription5'),
                ],
                image: locale.language === 'uk' ? 'single-system-uk.png' : 'single-system-en.png',
            },
        ],
        [t, locale],
    );

    return (
        <Box id="usage-scenarios" sx={{ display: 'flex', flexDirection: 'column', my: 5, gap: 2 }}>
            <Typography variant="h2" color={'text.primary'} sx={{ my: 3, textAlign: 'center' }}>
                {t('Usage scenarios')}
            </Typography>
            {useCases.map((item, index) => {
                return (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            flexDirection:
                                index % 2
                                    ? { xs: 'column', md: 'row-reverse' }
                                    : { xs: 'column', md: 'row' },
                            gap: { xs: 2, md: 6 },
                            borderRadius: 3,
                            py: 3,
                            px: 3,
                            // From https://css.glass
                            background: (theme) =>
                                theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(5px)',
                            webkitBackdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            minHeight: 380,
                            overflow: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 4,
                                height: '100%',
                                justifyContent: 'center',
                                gap: 2,
                                px: 3,
                            }}
                        >
                            <Typography variant="h3" color="primary">
                                {item.name}
                            </Typography>
                            {item.description.map((element, index) => {
                                return <Typography key={index}>{element}</Typography>;
                            })}
                        </Box>
                        <Box
                            id="use-case__image"
                            component="img"
                            sx={{
                                flex: 3,
                                width: '100%',
                                height: 'auto',
                                mx: ['auto'],
                                border: 1,
                                borderColor: 'grey.200',
                                borderRadius: 2,
                                p: 2,
                                minHeight: 0,
                                maxWidth: 400,
                                objectFit: 'contain',
                            }}
                            alt="Use case image"
                            src={item.image}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}
