import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { IPosition, maxDate, minDate } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPosition } from '../../services/position.service';
import { JobAndPay } from './details/JobAndPay';
import { Personal } from './details/Personal';
import { PositionHistory } from './details/PositionHistory';
import { AvatarBox } from '../../components/utility/AvatarBox';

export default function Position() {
    const params = useParams();
    const positionId = Number(params.positionId);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, payPeriod } = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [tab, setTab] = useState(Number(localStorage.getItem('position-tab-index')));

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

    const onCancel = async () => {
        await queryClient.invalidateQueries({ queryKey: ['position'], refetchType: 'all' });
        navigate(-1);
    };

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
            <PageTitle>
                <IconButton aria-label="Go Back" color="primary" sx={{ mr: 1 }} onClick={onCancel}>
                    <ArrowBackIosNewRounded />
                </IconButton>
                {generatePageTitle()}
            </PageTitle>
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
