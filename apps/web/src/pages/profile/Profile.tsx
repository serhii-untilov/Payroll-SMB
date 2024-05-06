import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { SyntheticEvent, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import * as Yup from 'yup';
import { FormInputDropdown } from '../../components/form/FormInputDropdown';
import { FormTextField } from '../../components/form/FormTextField';
import { Button } from '../../components/layout/Button';
import PageLayout from '../../components/layout/PageLayout';
import { AvatarBox } from '../../components/utility/AvatarBox';
import { Loading } from '../../components/utility/Loading';
import { supportedLanguages } from '../../context/LocaleContext';
import useLocale from '../../hooks/useLocale';
import { getCurrentUser } from '../../services/auth.service';
import { updateUser } from '../../services/user.service';
import { getDirtyValues } from '../../services/utils';
import { PageTitle } from '../../components/layout/PageTitle';
import { Tabs } from '../../components/layout/Tabs';
import { Tab } from '../../components/layout/Tab';
import { TabPanel } from '../../components/layout/TabPanel';
import { UserCompanyList } from './details/UserCompanyList';
import { UserDetails } from './details/UserDetails';
import { IUpdateUser } from '@repo/shared';

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
    const [value, setValue] = useState(0);
    const { supportedLocales, setLanguage } = useLocale();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const {
        data: user,
        isError: isQueryError,
        isLoading,
        error: queryError,
    } = useQuery<FormType, Error>('user-profile', async () => {
        return formSchema.cast(await getCurrentUser());
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: user || defaultValues,
        values: user || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

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

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        if (!data?.id) {
            enqueueSnackbar(`!data?.id`, { variant: 'error' });
            return;
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const user = await updateUser(data.id, dirtyValues as IUpdateUser);
            reset(user);
            user.language && setLanguage(user.language as supportedLanguages);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(user);
    };

    const generateTitle = () => {
        const userName = `${user?.firstName} ${user?.lastName}`.trim();
        return user?.id ? userName || user?.email || t('Profile') : t('New user');
    };

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <PageLayout>
            <PageTitle>{generateTitle()}</PageTitle>
            <AvatarBox />
            <Tabs id="user__details_tabs" value={value} onChange={handleChange}>
                <Tab label={t('User Profile')} />
                <Tab label={t('Companies')} disabled={!user?.id} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <UserDetails userId={user?.id} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <UserCompanyList userId={user?.id} />
            </TabPanel>
        </PageLayout>
    );
}
