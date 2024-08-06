import useLocale from '@/hooks/context/useLocale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function useScreenshots() {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [index, setIndex] = useState(0);

    useEffect(() => {}, [t]);

    const imageList = useMemo(
        () => [
            {
                img: locale.language === 'uk' ? '/screenshot-4-uk.png' : '/screenshot-4-en.png',
                title: t('Dashboard'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-1-uk.png' : '/screenshot-1-en.png',
                title: t('Employees'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-2-uk.png' : '/screenshot-2-en.png',
                title: t('Payroll'),
            },
            {
                img: locale.language === 'uk' ? '/screenshot-5-uk.png' : '/screenshot-5-en.png',
                title: t('Personal Card'),
            },
        ],
        [t, locale],
    );

    const onNextImage = useCallback(() => {
        if (index + 1 < imageList.length) {
            setIndex(index + 1);
        }
    }, [index, setIndex, imageList]);

    const onPriorImage = useCallback(() => {
        if (index > 0) {
            setIndex(index - 1);
        }
    }, [index, setIndex]);

    const image = useMemo(() => imageList[index].img, [imageList, index]);

    return { image, onNextImage, onPriorImage };
}
