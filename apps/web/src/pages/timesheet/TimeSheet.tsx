import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import useLocale from '../../hooks/useLocale';

export default function TimeSheet() {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('time-sheet-tab-index')),
    );

    useEffect(() => {}, [locale]);

    return (
        <>
            <PageLayout>
                <PageTitle goBack={goBack}>{t('Time Sheet')}</PageTitle>
            </PageLayout>
        </>
    );
}

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    // TODO
    // const map = { details: 0, periods: 1, departments: 2, managers: 3, accounts: 4 };
    // return map[tabName];
    return 0;
}
