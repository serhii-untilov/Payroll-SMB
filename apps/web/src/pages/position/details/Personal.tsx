import { yupResolver } from '@hookform/resolvers/yup';
import { AddCircleRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { createPerson, getPerson, updatePerson } from '../../../services/person.service';
import { getDirtyValues } from '../../../services/utils';
import { SelectSex } from '../../../components/select/SelectSex';

interface Props {
    personId: number;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    middleName: yup.string().nullable(),
    taxId: yup.string().nullable(),
    birthday: yup.date().nullable(),
    sex: yup.string().nullable(),
    phone: yup.string().nullable(),
    email: yup.string().nullable(),
    photo: yup.string().nullable(),
    deletedUserId: yup.number().nullable(),
    version: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

export function Personal({ personId }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {}, [company]);

    // To prevent Warning: A component is changing an uncontrolled input to be controlled.
    const defaultValues = {
        id: null,
        lastName: '',
        firstName: '',
        middleName: '',
        birthday: null,
        taxId: '',
        sex: '',
        phone: '',
        email: '',
        photo: '',
    };

    const { data, isError, error } = useQuery<FormType, Error>({
        queryKey: ['person', { personId }],
        queryFn: async () => {
            return formSchema.cast(await getPerson(personId, true));
        },
        enabled: !!personId,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: data, // || defaultValues,
        values: data, // || defaultValues,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    const { dirtyFields, isDirty } = useFormState({ control });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        formErrors.firstName?.message &&
            enqueueSnackbar(t(formErrors.firstName?.message), { variant: 'error' });
        formErrors.lastName?.message &&
            enqueueSnackbar(t(formErrors.lastName?.message), { variant: 'error' });
    }, [formErrors, t]);

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, {
            variant: 'error',
        });
    }
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(data);
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const person = data.id
                ? await updatePerson(data.id, { ...dirtyValues, version: data.version })
                : await createPerson(data);
            const updated = await getPerson(person.id, true);
            reset(updated);
            await queryClient.invalidateQueries({ queryKey: ['person'], refetchType: 'all' });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = async () => {
        reset(data);
        await queryClient.invalidateQueries({ queryKey: ['person'], refetchType: 'all' });
    };

    const onPrint = () => {
        console.log('onPrint');
    };

    const onExport = () => {
        console.log('onExport');
    };

    const onDelete = () => {
        console.log('onDelete');
    };

    const onRestoreDeleted = () => {
        console.log('onRestoreDeleted');
    };

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onPrint={'disabled'}
                    onExport={'disabled'}
                    // onDelete={'disabled'}
                    // onRestoreDeleted={'disabled'}
                />

                <Grid container md={12} lg={10} xl={8} spacing={2}>
                    <Grid item xs={12} md={4}>
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
                    <Grid item xs={12} md={4}>
                        <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="firstName"
                            id="firstName"
                            label={t('First Name')}
                            type="text"

                            // sx={{ fontWeight: 'bold' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormTextField
                            control={control}
                            autoComplete="full-name"
                            name="middleName"
                            id="middleName"
                            label={t('Middle Name')}
                            type="text"

                            // sx={{ fontWeight: 'bold' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormTextField
                            control={control}
                            name="taxId"
                            id="taxId"
                            label={t('Tax ID')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormDateField
                            control={control}
                            name="birthday"
                            id="birthday"
                            label={t('Birth Date')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <SelectSex control={control} name="sex" id="sex" label={t('Sex')} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="phone"
                            id="phone"
                            label={t('Phone')}
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormTextField
                            control={control}
                            name="email"
                            id="email"
                            label={t('Email')}
                            type="text"
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Button startIcon={<AddCircleRounded />}>{t('Add Payment Method')}</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button startIcon={<AddCircleRounded />}>{t('Add Tax Exemption')}</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button startIcon={<AddCircleRounded />}>{t('Add Home Address')}</Button>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
