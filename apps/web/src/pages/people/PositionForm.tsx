import { Box, IconButton, Tab, Tabs } from '@mui/material';
import { IPosition, maxDate, minDate } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { PropsWithChildren, ReactNode, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { PageSubTitle } from '../../components/layout/PageSubTitle';
import { TabPanel } from '../../components/layout/TabPanel';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import { getPosition } from '../../services/position.service';
import { PositionDetails } from './PositionDetails';
import { TabsVertical, SetTabProps } from '../../components/layout/TabsVertical';
import { ArrowBackIosNewRounded } from '@mui/icons-material';

interface Props extends PropsWithChildren {
    id: number | null;
    children?: ReactNode;
    index: number;
    value: number;
}

export default function Position(props: Props) {
    const { id, children, value, index, ...other } = props;
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
        queryKey: ['position', id],
        queryFn: async () => {
            return id ? await getPosition(id) : defaultValues;
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
        queryClient.invalidateQueries({ queryKey: ['position', id] });
    };

    const generatePageSubTitle = () => {
        return id ? position?.name : t('New Position');
    };

    return (
        <PageLayout>
            <PageSubTitle>
                <IconButton aria-label="Go Back" color="primary" sx={{ mr: 1 }} onClick={onCancel}>
                    <ArrowBackIosNewRounded />
                </IconButton>
                {generatePageSubTitle()}
            </PageSubTitle>
            <Box sx={{ flexGrow: 1, display: 'flex', height: 324 }}>
                <TabsVertical value={tab} onChange={handleChangeTab} sx={{ width: 350 }}>
                    <Tab label={t('Details')} {...SetTabProps(0)} />
                    <Tab label={t('History')} {...SetTabProps(1)} />
                    <Tab disabled label={t('Permanent Accruals')} {...SetTabProps(2)} />
                    <Tab label={t('Taxes and Deductions')} {...SetTabProps(3)} />
                    <Tab label={t('Time Off')} {...SetTabProps(4)} />
                    <Tab label={t('Payroll')} {...SetTabProps(6)} />
                    <Tab label={t('Payment')} {...SetTabProps(5)} />
                </TabsVertical>
                <TabPanel value={tab} index={0}>
                    <PositionDetails id={id} />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    Item Three
                </TabPanel>
                <TabPanel value={tab} index={3}>
                    Item Four
                </TabPanel>
                <TabPanel value={tab} index={4}>
                    Item Five
                </TabPanel>
                <TabPanel value={tab} index={5}>
                    Item Six
                </TabPanel>
            </Box>
        </PageLayout>
    );
}
