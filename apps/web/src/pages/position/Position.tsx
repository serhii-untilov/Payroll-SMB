import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { IPosition, maxDate, minDate } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { PropsWithChildren, ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageSubTitle } from '../../components/layout/PageSubTitle';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPosition } from '../../services/position.service';
import { JobAndPay } from './details/JobAndPay';
import { Personal } from './details/Personal';
import { Tab } from '../../components/layout/Tab';

interface Props extends PropsWithChildren {
    positionId: number | null;
    children?: ReactNode;
    index: number;
    value: number;
}

export default function Position(props: Props) {
    const { positionId } = useParams();
    const { children, value, index, ...other } = props;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    useEffect(() => {}, [company]);

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
            return positionId ? await getPosition(+positionId) : defaultValues;
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

    const generatePageSubTitle = () => {
        return positionId ? position?.name : t('New Position');
    };

    return (
        <PageLayout>
            <PageSubTitle>
                <IconButton aria-label="Go Back" color="primary" sx={{ mr: 1 }} onClick={onCancel}>
                    <ArrowBackIosNewRounded />
                </IconButton>
                {generatePageSubTitle()}
            </PageSubTitle>
            {/* <Box sx={{ flexGrow: 1, display: 'flex', height: 324 }}> */}
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
                <JobAndPay positionId={+positionId} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Personal personId={+positionId} />
            </TabPanel>
            <TabPanel value={tab} index={2}></TabPanel>
            <TabPanel value={tab} index={3}></TabPanel>
            <TabPanel value={tab} index={4}></TabPanel>
            {/* </Box> */}
        </PageLayout>
    );
}
