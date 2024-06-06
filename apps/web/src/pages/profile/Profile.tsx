import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import PageLayout from '../../components/layout/PageLayout';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { Tabs } from '../../components/layout/Tabs';
import { AvatarBox } from '../../components/utility/AvatarBox';
import { Loading } from '../../components/utility/Loading';
import useAuth from '../../hooks/useAuth';
import useLocale from '../../hooks/useLocale';
import { getCurrentUser } from '../../services/auth.service';
import { UserCompanyList } from './details/UserCompanyList';
import { UserDetails } from './details/UserDetails';

const formSchema = Yup.object().shape({
    id: Yup.number(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    language: Yup.string().nullable(),
});

type FormType = Yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    language: '',
};

export default function Profile() {
    const [tab, setTab] = useState(Number(localStorage.getItem('profile-tab-index')));
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();

    const {
        data: user,
        isError: isQueryError,
        isLoading,
        error: queryError,
    } = useQuery<FormType, Error>({
        queryKey: ['user', { id: currentUser?.id }],
        queryFn: async () => {
            return formSchema.cast(await getCurrentUser());
        },
    });

    const {
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: user || defaultValues,
        values: user || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.firstName?.message &&
            enqueueSnackbar(t(formErrors.firstName?.message), { variant: 'error' });
        formErrors.lastName?.message &&
            enqueueSnackbar(t(formErrors.lastName?.message), { variant: 'error' });
        formErrors.email?.message &&
            enqueueSnackbar(t(formErrors.email?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isLoading) {
        return <Loading />;
    }

    if (isQueryError) {
        return enqueueSnackbar(`${queryError.name}\n${queryError.message}`, { variant: 'error' });
    }

    const generateTitle = () => {
        const userName = `${user?.firstName} ${user?.lastName}`.trim();
        return user?.id ? userName || user?.email || t('Profile') : t('New user');
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
        localStorage.setItem('profile-tab-index', newValue.toString());
    };

    return (
        <PageLayout>
            <PageTitle>{generateTitle()}</PageTitle>
            <AvatarBox />
            <Tabs id="user__details_tabs" value={tab} onChange={handleChange}>
                <Tab label={t('User Profile')} />
                <Tab label={t('Companies')} disabled={!user?.id} />
            </Tabs>
            <TabPanel value={tab} index={0}>
                <UserDetails userId={user?.id} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <UserCompanyList userId={user?.id} />
            </TabPanel>
        </PageLayout>
    );
}
