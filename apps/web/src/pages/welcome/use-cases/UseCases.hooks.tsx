import useLocale from '@/hooks/context/useLocale';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useUseCases = () => {
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

    return { useCases };
};

export default useUseCases;
