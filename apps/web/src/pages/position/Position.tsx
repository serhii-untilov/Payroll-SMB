import { IPosition, maxDate, minDate } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { AvatarBox } from '../../components/utility/AvatarBox';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPosition } from '../../services/position.service';
import { JobAndPay } from './details/JobAndPay';
import { Personal } from './details/Personal';

export default function Position() {
    const params = useParams();
    const positionId = Number(params.positionId);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, payPeriod } = useAppContext();
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabName = searchParams.get('tab');
    const goBack = searchParams.get('return') === 'true';
    const [tab, setTab] = useState(
        tabName ? getTabIndex(tabName) : Number(localStorage.getItem('position-tab-index')),
    );

    const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('position-tab-index', newValue.toString());
    };

    useEffect(() => {}, [company, locale]);

    const defaultValues = useMemo((): Partial<IPosition> => {
        return {
            companyId: company?.id || 0,
            dateFrom: minDate(),
            dateTo: maxDate(),
        };
    }, [company]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
    } = useQuery<Partial<IPosition>, Error>({
        queryKey: ['position', { positionId, relations: true }],
        queryFn: async () => {
            return positionId
                ? await getPosition({
                      id: positionId,
                      relations: true,
                      onPayPeriodDate: payPeriod,
                  })
                : defaultValues;
        },
        enabled: !!company?.id && !!payPeriod,
    });

    useEffect(() => {}, [locale]);

    if (isPositionError) {
        return enqueueSnackbar(`${positionError.name}\n${positionError.message}`, {
            variant: 'error',
        });
    }

    const generatePageTitle = () => {
        const positionName = positionId
            ? position?.personId
                ? position?.person?.fullName || ''
                : t('Vacancy')
            : t('New Position');
        const jobName = (position?.history?.[0]?.job?.name || '').toLocaleLowerCase();
        return `${positionName}` + (jobName ? `, ${jobName}` : '');
    };

    const onSubmitCallback = async () => {
        console.log('onDetailSubmit');
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
    };

    return (
        <PageLayout>
            <PageTitle goBack={goBack}>{generatePageTitle()}</PageTitle>
            <AvatarBox />
            <Tabs value={tab} onChange={handleChangeTab}>
                <Tab label={t('Job & Pay')} />
                {/* <Tab label={t('Additional Earnings')} /> */}
                {/* <Tab label={t('Taxes and Deductions')} /> */}
                <Tab label={t('Personal')} disabled={!position?.person?.id} />
                {/* <Tab label={t('Assignments')} /> */}
                <Tab label={t('Time Off')} disabled={!position?.person?.id} />
                <Tab label={t('Documents')} />
                <Tab label={t('Notes')} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <JobAndPay positionId={positionId} onSubmitCallback={onSubmitCallback} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                {position?.personId && <Personal personId={position.personId} />}
            </TabPanel>
            {/* <TabPanel value={tab} index={2}>
                <PositionHistory positionId={positionId} />
            </TabPanel> */}
            <TabPanel value={tab} index={2}></TabPanel>
            <TabPanel value={tab} index={3}></TabPanel>
            <TabPanel value={tab} index={4}></TabPanel>
        </PageLayout>
    );
}

function getTabIndex(tabName: string | null): number {
    if (!tabName) {
        return 0;
    }
    const map = { details: 0, personal: 1, time: 2, documents: 3, notes: 4 };
    return map[tabName] || 0;
}
