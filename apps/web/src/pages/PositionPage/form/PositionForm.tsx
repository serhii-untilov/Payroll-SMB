import PageLayout from '@/components/layout/PageLayout';
import PageTitle from '@/components/layout/PageTitle';
import { Tab } from '@/components/layout/Tab';
import { TabPanel } from '@/components/layout/TabPanel';
import { Tabs } from '@/components/layout/Tabs';
import { AvatarBox } from '@/components/utility/AvatarBox';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { Position, PositionHistory } from '@repo/openapi';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JobAndPay } from '../tabs/JobAndPay';
import { Personal } from '../tabs/Personal';
import { usePageTitle } from '../hooks/usePageTitle';

interface PositionFormProps {
    position?: Position;
    positionHistory?: PositionHistory;
    tabIndex: string | null;
    goBack?: boolean;
    setPositionId?: (number) => void;
}

export default function PositionForm(props: PositionFormProps) {
    const { position, positionHistory, tabIndex, goBack, setPositionId } = props;
    const pageTitle = usePageTitle(position);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const [tab, setTab] = useState(
        tabIndex ? getTabIndex(tabIndex) : Number(localStorage.getItem('position-tab-index')),
    );

    useEffect(() => {}, [company, locale]);

    const handleChangeTab = (_event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('position-tab-index', newValue.toString());
    };

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{pageTitle}</PageTitle>
            <AvatarBox />
            <Tabs value={tab} onChange={handleChangeTab}>
                <Tab label={t('Job & Pay')} />
                <Tab label={t('Personal')} disabled={!position?.person?.id} />
                <Tab label={t('Time Off')} disabled={!position?.person?.id} />
                <Tab label={t('Documents')} />
                <Tab label={t('Notes')} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <JobAndPay
                    position={position}
                    positionHistory={positionHistory}
                    setPositionId={setPositionId}
                />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                {position?.personId && <Personal personId={position.personId} />}
            </TabPanel>
            <TabPanel value={tab} index={2}></TabPanel>
            <TabPanel value={tab} index={3}></TabPanel>
            <TabPanel value={tab} index={4}></TabPanel>
        </PageLayout>
    );
}

function getTabIndex(tabIndex: string | null): number {
    if (!tabIndex) {
        return 0;
    }
    const map = { details: 0, personal: 1, time: 2, documents: 3, notes: 4 };
    return map[tabIndex] || 0;
}
