import { api } from '@/api';
import {
    FormInputDropdown,
    FormTextField,
    InputLabel,
    SelectPayPeriod,
    Toolbar,
} from '@/components';
import {
    useAccountingList,
    useAppContext,
    useCompany,
    useDefaultAccountingId,
    useDefaultLawId,
    useLawList,
    useLocale,
} from '@/hooks';
import { companiesCreate } from '@/services/company.service';
import { getDirtyValues, invalidateQueries, snackbarFormErrors } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { CreateCompanyDto, PaymentSchedule, ResourceType, UpdateCompanyDto } from '@repo/openapi';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';

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
    const { data: company, isLoading } = useCompany(companyId);
    const { data: lawList, isLoading: isLoadingLawList } = useLawList();
    const { data: accountingList, isLoading: isLoadingAccountingList } = useAccountingList();
    const defaultLawId = useDefaultLawId(lawList);
    const defaultAccountingId = useDefaultAccountingId(accountingList);

    useEffect(() => {});

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
            .default(PaymentSchedule.LastDay),
        dateFrom: date().default(minDate()).required(),
        dateTo: date().default(maxDate()).required(),
        payPeriod: date().required('Pay Period required').default(monthBegin(new Date())),
        checkDate: date().required('Check Date required').default(monthEnd(new Date())),
    });

    type FormType = InferType<typeof formSchema>;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: formSchema.cast(company),
        values: formSchema.cast(company),
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = company?.id
                ? (
                      await api.companiesUpdate(company.id, {
                          ...(dirtyValues as UpdateCompanyDto),
                          version: company.version,
                      })
                  ).data
                : await companiesCreate(data as CreateCompanyDto);
            setCompanyId(response.id);
            reset(formSchema.cast(response));
            await invalidateQueries(queryClient, [ResourceType.Company, ResourceType.PayPeriod]);
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
        await invalidateQueries(queryClient, [ResourceType.Company]);
    };

    if (isLoading || isLoadingLawList || isLoadingAccountingList) return null;

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
                                    value={format(value ?? monthBegin(new Date()), 'yyyy-MM-dd')}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
