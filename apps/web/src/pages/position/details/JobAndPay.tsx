import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import {
    ICreatePosition,
    IPosition,
    IPositionHistory,
    PaymentGroup,
    formatDate,
    maxDate,
    minDate,
} from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import { SelectDepartment } from '../../../components/select/SelectDepartment';
import { SelectJob } from '../../../components/select/SelectJob';
import { SelectPaymentType } from '../../../components/select/SelectPaymentType';
import { SelectWorkNorm } from '../../../components/select/SelectWorkNorm';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { createPosition, getPosition, updatePosition } from '../../../services/position.service';
import {
    createPositionHistory,
    updatePositionHistory,
} from '../../../services/positionHistory.service';
import { getDirtyValues } from '../../../services/utils';
import { FormAutocomplete } from '../../../components/form/FormAutocomplete';

const formSchema = yup.object().shape({
    // Position
    id: yup.number().nullable(),
    companyId: yup.number().positive('Company is required').required(),
    cardNumber: yup.string().nullable(),
    sequenceNumber: yup.number().nullable(),
    description: yup.string().nullable(),
    personId: yup.number().nullable(),
    dateFrom: yup.date().required(),
    dateTo: yup.date().required(),
    deletedUserId: yup.number().nullable(),
    name: yup.string().nullable(),
    // A PositionHistory record actual on the current PayPeriod
    positionHistoryId: yup.number().nullable(),
    departmentId: yup.number().nullable(),
    jobId: yup.number().nullable(),
    workNormId: yup.number().nullable(),
    paymentTypeId: yup.number().nullable(),
    wage: yup.number().nullable(),
    rate: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

interface Props {
    positionId: number | null | undefined;
    onSubmitCallback?: () => void;
}

export function JobAndPay({ positionId, onSubmitCallback }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company, payPeriod } = useAppContext();
    const queryClient = useQueryClient();
    const [position, setPosition] = useState<Partial<IPosition>>({});

    useEffect(() => {}, [company]);

    const {
        data: formData,
        isError: isFormError,
        error: formError,
    } = useQuery<FormType, Error>({
        queryKey: ['Job & Pay', positionId],
        queryFn: async () => {
            const position = positionId
                ? await getPosition({ id: positionId, relations: true })
                : { companyId: company?.id, dateFrom: minDate(), dateTo: maxDate(), rate: 1 };
            setPosition(position);
            return formSchema.cast({ ...position_formData(position, payPeriod || new Date()) });
        },
        enabled: !!company && !!payPeriod,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: formData,
        values: formData,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({
        control,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.companyId?.message &&
            enqueueSnackbar(t(formErrors.companyId?.message), { variant: 'error' });
        formErrors.dateFrom?.message &&
            enqueueSnackbar(t(formErrors.dateFrom?.message), { variant: 'error' });
        formErrors.dateTo?.message &&
            enqueueSnackbar(t(formErrors.dateTo?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isFormError) {
        return enqueueSnackbar(`${formError.name}\n${formError.message}`, {
            variant: 'error',
        });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(formData);
        }
        if (!formData) {
            return;
        }
        if (onSubmitCallback) onSubmitCallback();
        const positionData = formData_Position(data);
        const positionHistoryData = formData_PositionHistory(data);
        const positionDirtyValues = getDirtyValues(dirtyFields, positionData);
        const positionHistoryDirtyValues = getDirtyValues(dirtyFields, positionHistoryData);
        try {
            let pos = position;
            if (Object.keys(positionDirtyValues).length) {
                pos = positionData.id
                    ? await updatePosition(positionData.id, positionDirtyValues)
                    : await createPosition(positionData);
            }
            if (Object.keys(positionHistoryDirtyValues).length) {
                if (!pos.id) {
                    throw Error('positionId not defined');
                }
                formData.positionHistoryId
                    ? await updatePositionHistory(
                          formData.positionHistoryId,
                          positionHistoryDirtyValues,
                      )
                    : await createPositionHistory({
                          positionId: pos.id,
                          dateFrom: pos.dateFrom,
                          dateTo: pos.dateTo,
                          ...positionHistoryDirtyValues,
                      });
            }
            // reset(await getFormData(formData.id));
            queryClient.invalidateQueries({ queryKey: ['Job & Pay', positionId] });
            positionId = pos.id;
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onSave = () => {
        handleSubmit(onSubmit);
    };

    const onCancel = () => {
        reset(formSchema.cast({ ...position_formData(position, payPeriod || new Date()) }));
        queryClient.invalidateQueries({ queryKey: ['Job & Pay', positionId] });
    };

    const onDelete = () => {
        console.log('onDelete');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onDelete={formData?.id ? onDelete : 'disabled'}
                    onRestoreDeleted={formData?.deletedUserId ? onRestoreDeleted : 'disabled'}
                    onPrint={formData?.id ? onPrint : 'disabled'}
                    onExport={formData?.id ? onExport : 'disabled'}
                    onShowHistory={'disabled'}
                />

                <Grid container xs={12} spacing={2}>
                    <Grid item xs={12} md={6}>
                        {/* <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="name"
                            id="name"
                            label={t('Full Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                            placeholder={t('Vacancy')}
                        /> */}
                        <FormAutocomplete
                            control={control}
                            autoComplete="full-name"
                            name="name"
                            id="name"
                            label={t('Full Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
                            placeholder={t('Vacancy')}
                            options={[]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="cardNumber"
                            id="cardNumber"
                            label={t('Card Number')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="sequenceNumber"
                            id="sequenceNumber"
                            label={t('Sequence Number')}
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SelectJob
                            companyId={company?.id}
                            control={control}
                            name="jobId"
                            id="jobId"
                            label={t('Job')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectDepartment
                            companyId={company?.id}
                            control={control}
                            name="departmentId"
                            id="departmentId"
                            label={t('Department')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <SelectWorkNorm
                            companyId={company?.id}
                            control={control}
                            name="workNormId"
                            id="workNormId"
                            label={t('Work Norm')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SelectPaymentType
                            companyId={company?.id}
                            control={control}
                            name="paymentTypeId"
                            id="paymentTypeId"
                            label={t('Payment Type')}
                            filter={{ groups: [PaymentGroup.BASIC] }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="wage"
                            id="wage"
                            label={t('Wage')}
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormTextField
                            control={control}
                            name="rate"
                            id="rate"
                            label={t('Rate')}
                            type="number"
                            defaultValue={'1'}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormDateField
                            control={control}
                            name="dateFrom"
                            id="dateFrom"
                            label={t('Date From')}
                            defaultValue={formatDate(minDate())}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormDateField
                            control={control}
                            name="dateTo"
                            id="dateTo"
                            label={t('Date To')}
                            defaultValue={formatDate(maxDate())}
                        />
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}

function position_formData(position: Partial<IPosition>, onDate: Date): Partial<FormType> {
    const {
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        name,
    } = position;
    const positionHistory: Partial<IPositionHistory> =
        position?.history?.find((o) => o.dateFrom <= onDate && o.dateTo >= onDate) || {};
    const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = positionHistory;
    return {
        // Position fields
        id,
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom: dateFrom || minDate(),
        dateTo: dateTo || maxDate(),
        deletedUserId,
        name: position?.personId ? position?.person?.fullName : '',
        // Position history fields
        positionHistoryId: positionHistory?.id,
        departmentId,
        jobId,
        workNormId,
        paymentTypeId,
        wage,
        rate,
    };
}

function formData_Position(formData: FormType): Partial<IPosition> {
    const {
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        name,
    } = formData;
    return {
        companyId,
        cardNumber,
        sequenceNumber,
        description,
        personId,
        dateFrom,
        dateTo,
        deletedUserId,
        name,
    };
}

function formData_PositionHistory(data: FormType): Partial<IPositionHistory> {
    const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = data;
    return {
        departmentId,
        jobId,
        workNormId,
        paymentTypeId,
        wage,
        rate,
    };
}
