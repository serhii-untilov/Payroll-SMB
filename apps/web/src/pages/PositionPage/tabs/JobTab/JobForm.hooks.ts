import { api } from '@/api';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { positionsCreate } from '@/services/api/position.service';
import {
    positionHistoryCreate,
    positionHistoryUpdate,
} from '@/services/api/positionHistory.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    CreatePositionDto,
    CreatePositionHistoryDto,
    Position,
    PositionHistory,
    ResourceType,
} from '@repo/openapi';
import { MAX_SEQUENCE_NUMBER, maxDate, minDate } from '@repo/shared';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { date, InferType, number, object, string } from 'yup';
import { JobFormProps } from './JobForm';
import { useNavigate } from 'react-router-dom';

export default function useJobForm(props: JobFormProps) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const invalidateQueries = useInvalidateQueries();
    const navigate = useNavigate();

    useEffect(() => {}, [locale]);

    const formSchema = useMemo(
        () =>
            object().shape({
                // Position
                cardNumber: string().ensure(),
                sequenceNumber: number().default(MAX_SEQUENCE_NUMBER),
                description: string().ensure(),
                personId: number().required().nullable(),
                fullName: string().nullable(),
                dateFrom: date().required().default(minDate()),
                dateTo: date().required().default(maxDate()),
                name: string().nullable(),
                // A PositionHistory record actual on the current PayPeriod
                departmentId: number().nullable(),
                jobId: number().nullable(),
                workNormId: number().nullable(),
                paymentTypeId: number().nullable(),
                wage: number().nullable().notRequired().optional(),
                rate: number().nullable().notRequired().optional().min(0).max(2),
                positionHistoryVersion: number().nullable(),
            }),
        [],
    );

    type FormType = InferType<typeof formSchema>;

    const position_formData = useCallback(
        (
            position: Position | undefined | null,
            positionHistory: PositionHistory | undefined | null,
        ): FormType => {
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
                workNormId: positionHistory?.workNormId || null,
                paymentTypeId: positionHistory?.paymentTypeId || null,
                wage: positionHistory?.wage || 0,
                rate: positionHistory?.rate || 0,
            };
        },
        [],
    );

    const formData = useMemo<FormType>(() => {
        return position_formData(props.position, props.positionHistory);
    }, [props, position_formData]);

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

    useEffect(() => {
        snackbarFormErrors(t, formErrors);
    }, [formErrors, t]);

    const formData_Position = useCallback(
        (data: FormType): CreatePositionDto => {
            const { cardNumber, sequenceNumber, description, personId, dateFrom, dateTo } = data;
            const companyId = props.company.id || 0;
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
        const { departmentId, jobId, workNormId, paymentTypeId, wage, rate } = data;
        return { departmentId, jobId, workNormId, paymentTypeId, wage: wage || 0, rate: rate || 1 };
    }, []);

    const onSubmit = useCallback<SubmitHandler<FormType>>(
        async (data) => {
            if (!isDirty) {
                reset(data);
            }
            if (!data) {
                return;
            }
            const positionData = formData_Position(data);
            const positionHistoryData = formData_PositionHistory(data);
            const positionDirtyValues = getDirtyValues(dirtyFields, positionData, true);
            const positionHistoryDirtyValues = getDirtyValues(
                dirtyFields,
                positionHistoryData,
                true,
            );
            try {
                const { position, positionHistory } = props;
                let pos = position;
                if (Object.keys(positionDirtyValues).length || !position) {
                    pos = position
                        ? (
                              await api.positionsUpdate(position.id, {
                                  ...positionDirtyValues,
                                  version: position.version,
                              })
                          ).data
                        : await positionsCreate(positionData);
                }
                let history = positionHistory;
                if (Object.keys(positionHistoryDirtyValues).length) {
                    if (!pos?.id) {
                        throw Error('positionId not defined');
                    }
                    history = positionHistory
                        ? await positionHistoryUpdate(positionHistory.id, {
                              ...positionHistoryDirtyValues,
                              version: positionHistory.version,
                          })
                        : await positionHistoryCreate({
                              ...positionHistoryDirtyValues,
                              positionId: pos.id,
                              dateFrom: pos.dateFrom,
                              dateTo: pos.dateTo,
                          });
                }
                if (pos && history) {
                    if (props.setPositionId) props.setPositionId(pos.id);
                    reset(formSchema.cast(position_formData(pos, history)));
                }
                await invalidateQueries([ResourceType.Position, ResourceType.PositionHistory]);
            } catch (e: unknown) {
                const error = e as AxiosError;
                snackbarError(`${error.code}\n${error.message}`);
            }
        },
        [
            dirtyFields,
            formData_Position,
            formData_PositionHistory,
            formSchema,
            invalidateQueries,
            isDirty,
            props,
            position_formData,
            reset,
        ],
    );

    const onCancel = useCallback(async () => {
        reset(formData);
        await invalidateQueries([ResourceType.Position, ResourceType.PositionHistory]);
    }, [formData, invalidateQueries, reset]);

    const onClickHistory = useCallback(() => {
        if (props.position?.id) {
            navigate(`position/:${props.position?.id}/history`);
        }
    }, [navigate, props]);

    return { control, isDirty, handleSubmit, onSubmit, onCancel, onClickHistory };
}
