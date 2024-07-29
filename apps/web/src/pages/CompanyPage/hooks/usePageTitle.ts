import { Company } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePageTitle(company: Company | undefined) {
    const { t } = useTranslation();

    return useMemo(() => {
        return company?.id ? company?.name ?? 'Noname' : t('New Company');
    }, [company, t]);
}
