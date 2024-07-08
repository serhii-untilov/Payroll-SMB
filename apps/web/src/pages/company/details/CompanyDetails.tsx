import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import {
    AccountingType,
    IAccounting,
    ICompany,
    ILaw,
    LawType,
    maxDate,
    minDate,
    monthBegin,
    monthEnd,
    PaymentSchedule,
} from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';
import { api } from '../../../api';
import { FormInputDropdown } from '../../../components/form/FormInputDropdown';
import { FormTextField } from '../../../components/form/FormTextField';
import { InputLabel } from '../../../components/layout/InputLabel';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectPayPeriod } from '../../../components/select/SelectPayPeriod';
import { Loading } from '../../../components/utility/Loading';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { getAccountingList } from '../../../services/accounting.service';
import { createCompany, updateCompany } from '../../../services/company.service';
import { getLawList } from '../../../services/law.service';
import { getDirtyValues } from '../../../services/utils';
import { snackbarError, snackbarFormErrors } from '../../../utils/snackbar';

type Props = {
    companyId: number | null;
    submitCallback: (companyId: number) => void;
};

export function CompanyDetails(props: Props) {
    const [companyId, setCompanyId] = useState(Number(props.companyId));
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    useEffect(() => {});

    const { data: lawList } = useQuery<ILaw[]>({
        queryKey: ['law', 'list'],
        queryFn: async () => await getLawList(),
    });

    const { data: accountingList } = useQuery<IAccounting[]>({
        queryKey: ['accounting', 'list'],
        queryFn: async () => await getAccountingList(),
    });

    const defaultLawId = useMemo(
        () => lawList?.find((o) => o.type === LawType.UKRAINE)?.id || 0,
        [lawList],
    );

    const defaultAccountingId = useMemo(
        () => accountingList?.find((o) => o.type === AccountingType.GENERIC)?.id || 0,
        [accountingList],
    );

    const {
        data: company,
        isError,
        isLoading,
        error: error,
    } = useQuery<Partial<ICompany>, Error>({
        queryKey: ['company', { companyId }],
        // queryFn: async () => (companyId ? await getCompany(companyId) : {}),
        queryFn: async () => (companyId ? await api.companiesFindOne(companyId) : {}),
        enabled: !!companyId,
    });

    const formSchema = object().shape({
        name: string().required('Name is required'),
        lawId: number().positive('Law is required').required().default(defaultLawId),
        taxId: string().default(''),
        accountingId: number()
            .positive('Accounting is required')
            .required()
            .default(defaultAccountingId),
        paymentSchedule: string()
            .required('Payment Schedule required')
            .default(PaymentSchedule.LAST_DAY),
        dateFrom: date().default(minDate()).required(),
        dateTo: date().default(maxDate()).required(),
        payPeriod: date().required('Pay Period required').default(monthBegin(new Date())),
        checkDate: date().required('Check Date required').default(monthEnd(new Date())),
        version: number().optional(),
    });

    type FormType = InferType<typeof formSchema>;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: formSchema.cast(company) || {},
        values: formSchema.cast(company) || {},
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        snackbarError(`${error.name}\n${error.message}`);
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = company?.id
                ? await updateCompany(company.id, dirtyValues)
                : await createCompany(data);
            setCompanyId(response.id);
            reset(formSchema.cast(response));
            await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
            await queryClient.invalidateQueries({ queryKey: ['payPeriod'], refetchType: 'all' });
            if (!currentCompany || currentCompany.id === response.id) {
                setCurrentCompany(response);
            }
            props.submitCallback(response?.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = async () => {
        setCompanyId(Number(company?.id));
        reset(formSchema.cast(company));
        await queryClient.invalidateQueries({ queryKey: ['company'], refetchType: 'all' });
    };

    return (
        <>
            <Toolbar
                onSave={isDirty || !currentCompany ? handleSubmit(onSubmit) : 'disabled'}
                onCancel={isDirty || !currentCompany ? onCancel : 'disabled'}
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
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <SelectPayPeriod
                                    companyId={companyId}
                                    label={''}
                                    name="payPeriod"
                                    autoComplete="payPeriod"
                                    error={!!error}
                                    onChange={(event: any) =>
                                        onChange(new Date(event.target.value))
                                    }
                                    value={format(value || monthBegin(new Date()), 'yyyy-MM-dd')}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
