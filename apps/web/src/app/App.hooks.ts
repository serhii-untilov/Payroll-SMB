import { api } from '@/api';
import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { setCompactView } from '@/store/slices/compactViewSlice';
import { selectCompany, setCompany } from '@/store/slices/companySlice';
import { selectPayPeriod, setPayPeriod } from '@/store/slices/payPeriodSlice';
import { setServerEvent } from '@/store/slices/serverEventSlice';
import { selectThemeMode, setThemeMode } from '@/store/slices/themeModeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store.hooks';
import { defaultTheme } from '@/themes/defaultTheme';
import { createTheme, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { ResourceType } from '@repo/openapi';
import { useEffect, useMemo } from 'react';

export default function useApp() {
    const wideScreen = useMediaQuery('(min-width:900px)');
    const { user } = useAuth();
    const { locale } = useLocale();
    const company = useAppSelector(selectCompany);
    const payPeriod = useAppSelector(selectPayPeriod);
    const themeMode = useAppSelector(selectThemeMode);
    const dispatch = useAppDispatch();
    const invalidateQueries = useInvalidateQueries();

    const theme = useMemo(
        () => responsiveFontSizes(createTheme(defaultTheme(themeMode), locale.locale)),
        [locale.locale, themeMode],
    );

    useEffect(() => {}, [locale, themeMode, company, payPeriod]);

    useEffect(() => {
        dispatch(setCompactView(!wideScreen));
    }, [dispatch, wideScreen]);

    useEffect(() => {
        dispatch(setThemeMode(localStorage.getItem('themeMode')));
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    useEffect(() => {
        const initCompany = async () => {
            const companyId = +(localStorage.getItem('companyId') ?? 0);
            const company =
                user &&
                (companyId
                    ? (await api.companiesFindOne(companyId)).data
                    : (await api.companiesFindFirst()).data);
            dispatch(setCompany(company));
        };
        initCompany();
    }, [dispatch, user]);

    useEffect(() => {
        if (company?.id) {
            localStorage.setItem('companyId', company.id.toString());
        }
    }, [company]);

    useEffect(() => {
        const initPayPeriod = async () => {
            dispatch(
                setPayPeriod(
                    company?.id
                        ? (await api.payPeriodsFindCurrent({ companyId: company.id })).data
                        : undefined,
                ),
            );
        };
        initPayPeriod();
    }, [dispatch, company]);

    const eventSource = useMemo(() => {
        return company?.id
            ? new EventSource(`/api/server-events/company-stream/${company?.id}`)
            : null;
    }, [company]);

    useEffect(() => {
        if (eventSource) {
            // eventSource.onerror = function (event) {
            //     setServerEvent(ServerEvent.COMMUNICATION_ERROR);
            //     console.log(
            //         `SSE: ${JSON.stringify(event, ['message', 'arguments', 'type', 'name'])}`,
            //     );
            // };
            eventSource.onmessage = async (event) => {
                if (event.data.includes('finished')) {
                    invalidateQueries([
                        ResourceType.Company,
                        ResourceType.Department,
                        ResourceType.PayPeriod,
                        ResourceType.Position,
                        ResourceType.Person,
                        ResourceType.Task,
                        ResourceType.Payment,
                    ]);
                }
                dispatch(setServerEvent(event.data));
            };
        }
    }, [dispatch, eventSource, invalidateQueries]);

    return { theme };
}
