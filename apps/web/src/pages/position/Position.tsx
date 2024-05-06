import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { IPosition, maxDate, minDate } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { PropsWithChildren, ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
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

export default function Position() {
    const params = useParams();
    const positionId = Number(params.positionId);
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
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
        queryKey: ['position', positionId],
        queryFn: async () => {
            return positionId
                ? await getPosition({ id: positionId, relations: true })
                : defaultValues;
        },
        enabled: !!company?.id,
    });

    useEffect(() => {}, [locale]);

    if (isPositionError) {
        return enqueueSnackbar(`${positionError.name}\n${positionError.message}`, {
            variant: 'error',
        });
    }

    const onCancel = () => {
        navigate(-1);
        queryClient.invalidateQueries({ queryKey: ['position', positionId] });
    };

    const generatePageTitle = () => {
        return positionId
            ? position?.personId
                ? position?.person?.fullName || ''
                : t('Vacancy')
            : t('New Position');
    };

    const onSubmitCallback = () => {
        console.log('onDetailSubmit');
        queryClient.invalidateQueries({ queryKey: ['position', positionId] });
        queryClient.invalidateQueries({ queryKey: ['positionList-relations', company?.id] });
    };

    return (
        <PageLayout>
            <PageTitle>
                <IconButton aria-label="Go Back" color="primary" sx={{ mr: 1 }} onClick={onCancel}>
                    <ArrowBackIosNewRounded />
                </IconButton>
                {generatePageTitle()}
            </PageTitle>
            <Tabs value={tab} onChange={handleChangeTab}>
                <Tab label={t('Job & Pay')} />
                {/* <Tab label={t('Additional Earnings')} /> */}
                {/* <Tab label={t('Taxes and Deductions')} /> */}
                <Tab label={t('Personal')} disabled={!position?.person?.id} />
                <Tab label={t('Time Off')} disabled={!position?.person?.id} />
                <Tab label={t('Documents')} />
                <Tab label={t('Notes')} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <JobAndPay positionId={positionId} onSubmitCallback={onSubmitCallback} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Personal personId={positionId} />
            </TabPanel>
            <TabPanel value={tab} index={2}></TabPanel>
            <TabPanel value={tab} index={3}></TabPanel>
            <TabPanel value={tab} index={4}></TabPanel>
        </PageLayout>
    );
}
