import useLocale from '@/hooks/context/useLocale';
import { useCreatePosition, useUpdatePosition } from '@/hooks/queries/usePosition';
import { useCreatePositionHistory, useUpdatePositionHistory } from '@/hooks/queries/usePositionHistory';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { AppMessage } from '@/types';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreatePositionDto, CreatePositionHistoryDto, Position, PositionHistory, Resource } from '@repo/openapi';
import { MAX_SEQUENCE_NUMBER, maxDate, minDate } from '@repo/shared';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { date, InferType, number, object, string } from 'yup';
import { JobFormProps } from './JobForm';

const useJobForm = (props: JobFormProps) => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { invalidateQueries } = useInvalidateQueries();
    const navigate = useNavigate();
    const formSchema = useFormSchema();
    type FormType = InferType<typeof formSchema>;
    const createPosition = useCreatePosition();
    const updatePosition = useUpdatePosition();
    const createPositionHistory = useCreatePositionHistory();
    const updatePositionHistory = useUpdatePositionHistory();
    const formData = useMemo<FormType>(
        () => getFormData(props.position, props.positionHistory),
        [props.position, props.positionHistory],
    );
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
    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);
    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);

    const formData_Position = useCallback(
        (data: FormType): CreatePositionDto => {
            const { cardNumber, sequenceNumber, description, personId, dateFrom, dateTo } = data;
            const companyId = props.company.id;
            return {
                companyId,
                cardNumber,
                sequenceNumber,
                description,
                personId,
                dateFrom,
                dateTo,
            };
        },
        [props],
    );

    const formData_PositionHistory = useCallback((data: FormType): CreatePositionHistoryDto => {
        const { departmentId, jobId, workTimeNormId, paymentTypeId, wage, rate } = data;
        return {
            departmentId,
            jobId,
            workTimeNormId,
            paymentTypeId,
            wage: wage || 0,
            rate: rate || 1,
        };
    }, []);

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty) {
                reset(data);
            }
            if (!data) return;
            const positionData = formData_Position(data);
            const positionHistoryData = formData_PositionHistory(data);
            const positionDirtyValues = getDirtyValues(dirtyFields, positionData, true);
            const positionHistoryDirtyValues = getDirtyValues(dirtyFields, positionHistoryData, true);
            try {
                const { position, positionHistory } = props;
                let pos = position;
                if (Object.keys(positionDirtyValues).length || !position) {
                    pos = position
                        ? await updatePosition.mutateAsync({
                              id: position.id,
                              dto: {
                                  ...positionDirtyValues,
                                  version: position.version,
                              },
                          })
                        : await createPosition.mutateAsync(positionData);
                }
                let history = positionHistory;
                if (Object.keys(positionHistoryDirtyValues).length) {
                    if (!pos?.id) {
                        throw Error('positionId not defined');
                    }
                    history = positionHistory
                        ? await updatePositionHistory.mutateAsync({
                              id: positionHistory.id,
                              dto: {
                                  ...positionHistoryDirtyValues,
                                  version: positionHistory.version,
                              },
                          })
                        : await createPositionHistory.mutateAsync({
                              ...positionHistoryDirtyValues,
                              positionId: pos.id,
                              dateFrom: pos.dateFrom,
                              dateTo: pos.dateTo,
                          });
                }
                if (pos && history) {
                    if (props.setPositionId) props.setPositionId(pos.id);
                    reset(formSchema.cast(getFormData(pos, history)));
                }
            } catch (e: unknown) {
                snackbarError(e as AppMessage);
            }
        },
        [
            createPosition,
            createPositionHistory,
            dirtyFields,
            formData_Position,
            formData_PositionHistory,
            formSchema,
            isDirty,
            props,
            reset,
            updatePosition,
            updatePositionHistory,
        ],
    );

    const onCancel = useCallback(async () => {
        reset(formData);
        await invalidateQueries([Resource.Position, Resource.PositionHistory]);
    }, [formData, invalidateQueries, reset]);

    const onClickHistory = useCallback(() => {
        if (props.position?.id) {
            navigate(`position/${props.position?.id}/history`);
        }
    }, [navigate, props]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel, onClickHistory };
};

function useFormSchema() {
    return useMemo(
        () =>
            object().shape({
                // Position
                cardNumber: string().ensure(),
                sequenceNumber: number().default(MAX_SEQUENCE_NUMBER),
                description: string().ensure(),
                personId: string().required().nullable(),
                fullName: string().nullable(),
                dateFrom: date().required().default(minDate()),
                dateTo: date().required().default(maxDate()),
                name: string().nullable(),
                // A PositionHistory record actual on the current PayPeriod
                departmentId: string().nullable(),
                jobId: string().nullable(),
                workTimeNormId: string().nullable(),
                paymentTypeId: string().nullable(),
                wage: number().nullable().notRequired().optional(),
                rate: number().nullable().notRequired().optional().min(0).max(2),
                positionHistoryVersion: number().nullable(),
            }),
        [],
    );
}

function getFormData(position: Position | undefined | null, positionHistory: PositionHistory | undefined | null) {
    return {
        // Position fields
        cardNumber: position?.cardNumber || '',
        sequenceNumber: position?.sequenceNumber || MAX_SEQUENCE_NUMBER,
        description: position?.description || '',
        personId: position?.personId || null,
        fullName: position?.person?.fullName || null,
        dateFrom: position?.dateFrom || minDate(),
        dateTo: position?.dateTo || maxDate(),
        // Position history fields
        departmentId: positionHistory?.departmentId || null,
        jobId: positionHistory?.jobId || null,
        workTimeNormId: positionHistory?.workTimeNormId || null,
        paymentTypeId: positionHistory?.paymentTypeId || null,
        wage: positionHistory?.wage || 0,
        rate: positionHistory?.rate || 0,
    };
}

export default useJobForm;
