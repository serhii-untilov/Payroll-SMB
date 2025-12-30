import useLocale from '@/hooks/context/useLocale';
import { useCreateCompany, useUpdateCompany } from '@/hooks/queries/useCompany';
import useDefaultAccountingId from '@/hooks/useDefaultAccountingId';
import useDefaultLawId from '@/hooks/useDefaultLawId';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { selectCompany, setCompany } from '@/store/slices/companySlice';
import { useAppDispatch, useAppSelector } from '@/store/store.hooks';
import { AppMessage } from '@/types';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateCompanyDto, PaymentSchedule, Resource, UpdateCompanyDto } from '@repo/openapi';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useFormState, useForm as useReactHookForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, object, string } from 'yup';
import { CompanyDetailsProps } from './CompanyDetails';

export default function useCompanyDetails(props: CompanyDetailsProps) {
    const { company, setCompanyId } = props;
    const currentCompany = useAppSelector(selectCompany);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { locale } = useLocale();
    const formSchema = useFormSchema();
    const createCompany = useCreateCompany();
    const updateCompany = useUpdateCompany();
    const { invalidateQueries } = useInvalidateQueries();
    type FormType = InferType<typeof formSchema>;
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useReactHookForm({
        defaultValues: company,
        values: company,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });
    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);
    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const save = useCallback(
        async (data: FormType) => {
            const dirtyValues = getDirtyValues(dirtyFields, data);
            return company?.id
                ? await updateCompany.mutateAsync({
                      id: company.id,
                      dto: { ...(dirtyValues as UpdateCompanyDto), version: company.version },
                  })
                : await createCompany.mutateAsync(data as CreateCompanyDto);
        },
        [company, createCompany, dirtyFields, updateCompany],
    );

    const onSubmit: SubmitHandler<FormType> = useCallback(
        async (data) => {
            if (!isDirty) return;
            try {
                const response = await save(data);
                if (setCompanyId) setCompanyId(response.id);
                reset(formSchema.cast(response));
                if (!currentCompany || currentCompany.id === response.id) {
                    dispatch(setCompany(response));
                }
                if (setCompanyId) setCompanyId(response?.id);
            } catch (e: unknown) {
                snackbarError(e as AppMessage);
            }
        },
        [currentCompany, dispatch, formSchema, isDirty, reset, save, setCompanyId],
    );

    const onCancel = useCallback(async () => {
        if (setCompanyId) setCompanyId(company?.id);
        reset(formSchema.cast(company));
        await invalidateQueries([Resource.Company]);
    }, [company, reset, setCompanyId, invalidateQueries, formSchema]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
}

function useFormSchema() {
    const defaultLawId = useDefaultLawId();
    const defaultAccountingId = useDefaultAccountingId();
    const formSchema = useMemo(
        () =>
            object().shape({
                name: string().required('Name is required'),
                lawId: string().required('Law is required').default(defaultLawId),
                taxId: string().default(''),
                accountingId: string()
                    .required('Accounting is required')
                    .default(defaultAccountingId),
                paymentSchedule: string()
                    .required('Payment Schedule required')
                    .default(PaymentSchedule.LastDay),
                dateFrom: date().default(minDate()).required(),
                dateTo: date().default(maxDate()).required(),
                payPeriod: date().required('Pay Period required').default(monthBegin(new Date())),
                checkDate: date().required('Check Date required').default(monthEnd(new Date())),
            }),
        [defaultAccountingId, defaultLawId],
    );
    return formSchema;
}
