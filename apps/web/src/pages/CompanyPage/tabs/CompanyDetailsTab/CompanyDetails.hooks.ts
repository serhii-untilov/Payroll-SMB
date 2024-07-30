import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { companiesCreate, companiesUpdate } from '@/services/api/company.service';
import { AppError } from '@/types';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Company,
    CreateCompanyDto,
    PaymentSchedule,
    ResourceType,
    UpdateCompanyDto,
} from '@repo/openapi';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { useEffect } from 'react';
import { SubmitHandler, useFormState, useForm as useReactHookForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';

interface Props {
    company: Company | undefined;
    defaultLawId: number;
    defaultAccountingId: number;
    setCompanyId?: (companyId: number) => void;
}

export default function useCompanyDetails(props: Props) {
    const { company, defaultLawId, defaultAccountingId, setCompanyId } = props;
    const { t } = useTranslation();
    const { company: currentCompany, setCompany: setCurrentCompany } = useAppContext();
    const invalidateQueries = useInvalidateQueries();
    const { locale } = useLocale();

    useEffect(() => {}, [locale]);

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
    } = useReactHookForm({
        defaultValues: formSchema.cast(company),
        values: formSchema.cast(company),
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const response = company?.id
                ? await companiesUpdate(company.id, {
                      ...(dirtyValues as UpdateCompanyDto),
                      version: company.version,
                  })
                : await companiesCreate(data as CreateCompanyDto);
            if (setCompanyId) setCompanyId(response.id);
            reset(formSchema.cast(response));
            await invalidateQueries([ResourceType.Company, ResourceType.PayPeriod]);
            if (!currentCompany || currentCompany.id === response.id) {
                setCurrentCompany(response);
            }
            if (setCompanyId) setCompanyId(response?.id);
        } catch (e: unknown) {
            const error = e as AppError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        if (setCompanyId) setCompanyId(Number(company?.id));
        reset(formSchema.cast(company));
        await invalidateQueries([ResourceType.Company]);
    };

    return { control, isDirty, handleSubmit, onSubmit, onCancel };
}
