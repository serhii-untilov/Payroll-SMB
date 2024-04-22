import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IPosition, formatDate, maxDate, minDate } from '@repo/shared';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Dispatch, Fragment, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { FormDateField } from '../../components/form/FormDateField';
import { FormTextField } from '../../components/form/FormTextField';
import { Button } from '../../components/layout/Button';
import useAppContext from '../../hooks/useAppContext';
import useLocale from '../../hooks/useLocale';
import {
    createPosition,
    getPosition,
    getPositionList,
    updatePosition,
} from '../../services/position.service';
import { getDirtyValues } from '../../services/utils';

interface Params {
    open: boolean;
    setOpen: Dispatch<boolean>;
    positionId: number | null;
    submitCallback?: Dispatch<IPosition>;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required('Name is required'),
    companyId: yup.number().positive('Company is required').required(),
    dateFrom: yup.date().nullable(),
    dateTo: yup.date().nullable(),
    parentPositionId: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

export function PositionForm(params: Params) {
    const { positionId, submitCallback } = params;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {}, [company]);

    // To prevent Warning: A component is changing an uncontrolled input to be controlled.
    const defaultValues = useMemo((): FormType => {
        return {
            id: null,
            name: '',
            companyId: company?.id || 0,
            dateFrom: minDate(),
            dateTo: maxDate(),
        };
    }, [company]);

    const {
        data: position,
        isError: isPositionError,
        error: positionError,
    } = useQuery<FormType, Error>({
        queryKey: ['position', positionId],
        queryFn: async () => {
            return formSchema.cast(
                positionId
                    ? await getPosition(positionId)
                    : { ...defaultValues, companyId: company?.id },
            );
        },
        enabled: !!company?.id,
    });

    const {
        data: positionList,
        isError: isPositionListError,
        error: positionListError,
    } = useQuery<IPosition[], Error>({
        queryKey: ['positionList', company?.id],
        queryFn: async () => {
            return company?.id ? await getPositionList(company?.id) : [];
        },
        enabled: !!company?.id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: position || defaultValues,
        values: position || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.name?.message &&
            enqueueSnackbar(t(formErrors.name?.message), { variant: 'error' });
        formErrors.companyId?.message &&
            enqueueSnackbar(t(formErrors.companyId?.message), { variant: 'error' });
        formErrors.dateFrom?.message &&
            enqueueSnackbar(t(formErrors.dateFrom?.message), { variant: 'error' });
        formErrors.dateTo?.message &&
            enqueueSnackbar(t(formErrors.dateTo?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isPositionError) {
        return enqueueSnackbar(`${positionError.name}\n${positionError.message}`, {
            variant: 'error',
        });
    }

    if (isPositionListError) {
        return enqueueSnackbar(`${positionListError.name}\n${positionListError.message}`, {
            variant: 'error',
        });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(position);
            params.setOpen(false);
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const position = data.id
                ? await updatePosition(data.id, dirtyValues)
                : await createPosition(data);
            reset(position);
            if (submitCallback) submitCallback(position);
            params.setOpen(false);
            reset(defaultValues);
            queryClient.invalidateQueries({ queryKey: ['position', positionId] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(defaultValues);
        params.setOpen(false);
        queryClient.invalidateQueries({ queryKey: ['position', positionId] });
    };

    return (
        <Fragment>
            <Dialog
                fullWidth={false}
                maxWidth={'lg'}
                disableRestoreFocus
                open={params.open}
                onClose={() => {
                    params.setOpen(false);
                    reset(position);
                    queryClient.invalidateQueries({ queryKey: ['position', positionId] });
                }}
                // PaperProps={{
                //     component: 'form',
                //     onSubmit: (event: FormEvent<HTMLFormElement>) => {
                //         event.preventDefault();
                //         handleSubmit(onSubmit);
                //         params.setOpen(false);
                //     },
                // }}
            >
                <DialogTitle>{t('Position')}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will
                        send updates occasionally.
                    </DialogContentText> */}
                    <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FormTextField
                                control={control}
                                autoComplete="last-name"
                                name="lastName"
                                id="lastName"
                                label={t('Last Name')}
                                type="text"
                                autoFocus
                                // sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormTextField
                                control={control}
                                autoComplete="first-name"
                                name="firstName"
                                id="firstName"
                                label={t('First Name')}
                                type="text"
                                // sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormTextField
                                control={control}
                                autoComplete="middle-name"
                                name="middleName"
                                id="middleName"
                                label={t('Middle Name')}
                                type="text"

                                // sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormDateField
                                control={control}
                                autoComplete="date-from"
                                name="dateFrom"
                                id="dateFrom"
                                label={t('Date From')}
                                defaultValue={formatDate(minDate())}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormDateField
                                control={control}
                                autoComplete="date-to"
                                name="dateTo"
                                id="dateTo"
                                label={t('Date To')}
                                defaultValue={formatDate(maxDate())}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2, pt: 0 }}>
                    <Button onClick={handleSubmit(onSubmit)}>{t('Update')}</Button>
                    <Button color="secondary" onClick={onCancel}>
                        {t('Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
