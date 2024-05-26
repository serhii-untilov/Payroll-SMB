import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { IAccounting, ILaw, PaymentSchedule, maxDate, minDate } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { endOfMonth, format, startOfDay, startOfMonth } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormInputDropdown } from '../../../components/form/FormInputDropdown';
import { FormTextField } from '../../../components/form/FormTextField';
import { InputLabel } from '../../../components/layout/InputLabel';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectPayPeriod } from '../../../components/select/SelectPayPeriod';
import { Loading } from '../../../components/utility/Loading';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { getAccountingList } from '../../../services/accounting.service';
import { createCompany, getCompany, updateCompany } from '../../../services/company.service';
import { getLawList } from '../../../services/law.service';
import { getDirtyValues } from '../../../services/utils';

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required('Name is required'),
    lawId: yup.number().positive('Law is required').required(),
    taxId: yup.string(),
    accountingId: yup.number().positive('Accounting is required').required(),
    paymentSchedule: yup.string().required(),
    dateFrom: yup.date().nullable(),
    dateTo: yup.date().nullable(),
    payPeriod: yup.date().required(),
    checkDate: yup.date().required(),
    version: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: null,
    name: '',
    lawId: 0,
    taxId: '',
    accountingId: 0,
    paymentSchedule: PaymentSchedule.LAST_DAY,
    dateFrom: minDate(),
    dateTo: maxDate(),
    payPeriod: startOfMonth(new Date()),
    checkDate: startOfDay(endOfMonth(new Date())),
};

type Props = {
    companyId: number | undefined;
};

export function CompanyDetails(props: Props) {
    // const { companyId } = props;
    const [companyId, setCompanyId] = useState(props.companyId);
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {});

    const {
        data: company,
        isError: isCompanyError,
        isLoading: isCompanyLoading,
        error: companyError,
    } = useQuery<FormType, Error>({
        queryKey: ['company', { companyId }],
        queryFn: async () => {
            return formSchema.cast(companyId ? await getCompany(companyId) : defaultValues);
        },
        // enabled: !!companyId,
    });

    const {
        data: lawList,
        isError: isLawListError,
        isLoading: isLawListLoading,
        error: lawListError,
    } = useQuery<ILaw[], Error>({
        queryKey: ['lawList'],
        queryFn: async () => {
            return getLawList();
        },
    });

    const {
        data: accountingList,
        isError: isAccountingListError,
        isLoading: isAccountingListLoading,
        error: accountingListError,
    } = useQuery<IAccounting[], Error>({
        queryKey: ['accounting', 'list'],
        queryFn: async () => {
            return getAccountingList();
        },
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
        // setCurrentCompany(null);
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

    // const onChangePayPeriod = (e: any) => {
    //     console.log(e.target.value);
    //     e.target.value = format(startOfMonth(new Date(e.target.value)), 'P');
    //     console.log(e.target.value);
    // };

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const company = data.id
                ? await updateCompany(data.id, { ...dirtyValues, version: data.version })
                : await createCompany(data);
            reset(company);
            await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
            if (!currentCompany || currentCompany.id === company.id) {
                setCurrentCompany(company);
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = async () => {
        reset(company);
        await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
    };

    return (
        <>
            <Toolbar
                onSave={isDirty || !currentCompany ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty || !currentCompany ? onCancel : 'disabled'}
                // onDelete={'disabled'}
                // onRestoreDeleted={'disabled'}
                // onShowHistory={'disabled'}
            />
            <Grid
                container
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                spacing={2}
                sx={{ mb: 1 }}
            >
                <Grid container item xs={12} sm={12} md={8} lg={6} spacing={2}>
                    <Grid item xs={12}>
                        <FormTextField
                            control={control}
                            autoComplete="given-name"
                            name="name"
                            id="name"
                            label={t('Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
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
                    <Grid item xs={12} sm={8} md={6}>
                        <FormTextField
                            control={control}
                            required
                            label={t('Tax ID')}
                            name="taxId"
                            type="text"
                            autoComplete="taxId"
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} md={6}>
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
                    <Grid item xs={12} sm={8} md={6}>
                        <InputLabel>{t('Pay Period')}</InputLabel>
                        <Controller
                            name={'payPeriod'}
                            control={control}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                                formState,
                            }) => (
                                <SelectPayPeriod
                                    label={''}
                                    name="payPeriod"
                                    autoComplete="payPeriod"
                                    error={!!error}
                                    onChange={(event: any) =>
                                        onChange(new Date(event.target.value))
                                    }
                                    value={format(value || startOfMonth(new Date()), 'yyyy-MM-dd')}
                                />
                            )}
                        />
                    </Grid>
                    {/* {(isDirty || !currentCompany) && (
                        <Grid item xs={12} sx={{ mb: 1 }}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Button type="submit">{t('Update')}</Button>
                                </Grid>

                                <Grid item>
                                    <Button color="secondary" onClick={onCancel}>
                                        {t('Cancel')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )} */}
                </Grid>
            </Grid>
        </>
    );
}
