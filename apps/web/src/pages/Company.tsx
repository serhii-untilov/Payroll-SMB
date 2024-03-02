import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { IAccounting, ILaw } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { FormButton } from '../components/form/FormButton';
import { FormInputDropdown } from '../components/form/FormInputDropdown';
import { FormTextField } from '../components/form/FormTextField';
import PageLayout from '../components/layout/PageLayout';
import { Loading } from '../components/utility/Loading';
import useLocale from '../hooks/useLocale';
import { getAccountingList } from '../services/accounting.service';
import { createCompany, getCompany, updateCompany } from '../services/company.service';
import { getLawList } from '../services/law.service';
import { getDirtyValues } from '../services/utils';
import * as _ from 'lodash';
import useAppContext from '../hooks/useAppContext';

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required('Name is required'),
    lawId: yup.number().positive('Law is required').required(),
    taxId: yup.string(),
    accountingId: yup.number().positive('Accounting is required').required(),
    dateFrom: yup.date().required('DateFrom is required'),
    dateTo: yup.date().required('DateTo is required'),
    payPeriod: yup.date().required('Pay period is required'),
    checkDate: yup.date().required('Check date is required'),
});

type FormType = yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: null,
    name: '',
    lawId: 0,
    taxId: '',
    accountingId: 0,
    dateFrom: new Date('1970-01-01'),
    dateTo: new Date('1970-01-01'),
    payPeriod: new Date('1970-01-01'),
    checkDate: new Date('9999-12-31'),
};

export default function Company() {
    const { id } = useParams();
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();

    const {
        data: company,
        isError: isCompanyError,
        isLoading: isCompanyLoading,
        error: companyError,
    } = useQuery<FormType, Error>('company', async () => {
        const companyId = id ? +id : currentCompany?.id;
        return formSchema.cast(companyId ? await getCompany(companyId) : defaultValues);
    });

    const {
        data: lawList,
        isError: isLawListError,
        isLoading: isLawListLoading,
        error: lawListError,
    } = useQuery<ILaw[], Error>('lawList', async () => {
        return getLawList();
    });

    const {
        data: accountingList,
        isError: isAccountingListError,
        isLoading: isAccountingListLoading,
        error: accountingListError,
    } = useQuery<IAccounting[], Error>('accountingList', async () => {
        return getAccountingList();
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: company || defaultValues,
        values: company || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.name?.message &&
            enqueueSnackbar(t(formErrors.name?.message), { variant: 'error' });
        formErrors.lawId?.message &&
            enqueueSnackbar(t(formErrors.lawId?.message), { variant: 'error' });
        formErrors.accountingId?.message &&
            enqueueSnackbar(t(formErrors.accountingId?.message), { variant: 'error' });
        formErrors.payPeriod?.message &&
            enqueueSnackbar(t(formErrors.payPeriod?.message), { variant: 'error' });
        formErrors.checkDate?.message &&
            enqueueSnackbar(t(formErrors.checkDate?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isCompanyLoading || isLawListLoading || isAccountingListLoading) {
        return <Loading />;
    }

    if (isCompanyError) {
        return enqueueSnackbar(`${companyError.name}\n${companyError.message}`, {
            variant: 'error',
        });
    }

    if (isLawListError) {
        return enqueueSnackbar(`${lawListError.name}\n${lawListError.message}`, {
            variant: 'error',
        });
    }

    if (isAccountingListError) {
        return enqueueSnackbar(`${accountingListError.name}\n${accountingListError.message}`, {
            variant: 'error',
        });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const company = data.id
                ? await updateCompany(data.id, dirtyValues)
                : await createCompany(data);
            reset(company);
            if (!currentCompany || currentCompany.id === company.id) {
                setCurrentCompany(company);
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(company);
    };

    return (
        <PageLayout title={t('Company')}>
            <Grid
                container
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                spacing={2}
            >
                <Grid container item xs={12} sm={7} md={6} lg={4} spacing={2}>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            autoComplete="given-name"
                            name="name"
                            id="name"
                            label={t('Name')}
                            type="text"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormInputDropdown
                            control={control}
                            label={t('Law')}
                            name="lawId"
                            autoComplete="lawId"
                            type="number"
                            options={
                                lawList?.map((o) => {
                                    return { label: o.name, value: o.id };
                                }) ?? []
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            required
                            label={t('Tax ID')}
                            name="taxId"
                            type="text"
                            autoComplete="taxId"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormInputDropdown
                            control={control}
                            label={t('Accounting')}
                            name="accountingId"
                            autoComplete="accountingId"
                            type="number"
                            options={
                                accountingList?.map((o) => {
                                    return { label: o.name, value: o.id };
                                }) ?? []
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item>
                                <FormButton type="submit" variant="contained" color="primary">
                                    {t('Update')}
                                </FormButton>
                            </Grid>
                            <Grid item>
                                <FormButton
                                    onClick={onCancel}
                                    variant="contained"
                                    color="warning"
                                    disabled={!isDirty}
                                >
                                    {t('Cancel')}
                                </FormButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </PageLayout>
    );
}