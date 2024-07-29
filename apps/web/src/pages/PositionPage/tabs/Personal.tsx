import { FormDateField } from '@/components/form/FormDateField';
import { FormTextField } from '@/components/form/FormTextField';
import { TabLayout } from '@/components/layout/TabLayout';
import Toolbar from '@/components/layout/Toolbar';
import { SelectSex } from '@/components/SelectSex';
import useAppContext from '@/hooks/context/useAppContext';
import useLocale from '@/hooks/context/useLocale';
import { usePerson } from '@/hooks/queries/usePersons';
import { personsFindOne, personsUpdate } from '@/services/api/person.service';
import { getDirtyValues } from '@/utils/getDirtyValues';
import { invalidateQueries } from '@/utils/invalidateQueries';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddCircleRounded } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import { ResourceType, UpdatePersonDto } from '@repo/openapi';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

interface Props {
    personId: number;
}

const formSchema = yup.object().shape({
    id: yup.number().required(),
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    middleName: yup.string(),
    taxId: yup.string(),
    birthday: yup.date().nullable(),
    sex: yup.string(),
    phone: yup.string(),
    email: yup.string(),
    photo: yup.string(),
});

type FormType = yup.InferType<typeof formSchema>;

export function Personal({ personId }: Props) {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { company } = useAppContext();
    const queryClient = useQueryClient();
    const { data: person, isLoading } = usePerson(personId);

    useEffect(() => {}, [company, locale]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: person,
        values: person,
        resolver: yupResolver<FormType>(formSchema),
        shouldFocusError: true,
    });

    useEffect(() => snackbarFormErrors(t, formErrors), [formErrors, t]);
    const { dirtyFields, isDirty } = useFormState({ control });
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        if (!data) return;
        if (!person) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            await personsUpdate(data.id, {
                ...(dirtyValues as UpdatePersonDto),
                version: person.version,
            });
            const updated = await personsFindOne(personId);
            reset(updated as FormType);
            await invalidateQueries(queryClient, [ResourceType.Person]);
        } catch (e: unknown) {
            const error = e as AxiosError;
            snackbarError(`${error.code}\n${error.message}`);
        }
    };

    const onCancel = async () => {
        reset(formSchema.cast(person));
        await invalidateQueries(queryClient, [ResourceType.Person]);
    };

    if (isLoading) return null;

    return (
        <>
            <TabLayout>
                <Toolbar
                    onSave={isDirty ? handleSubmit(onSubmit) : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onPrint={'disabled'}
                    onExport={'disabled'}
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
                <Grid container sx={{ mt: 2 }} md={12} lg={10} xl={8} spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>
                                {t('Add Payment Method')}
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>
                                {t('Add Tax Exemption')}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid item xs={12}>
                            <Button startIcon={<AddCircleRounded />}>
                                {t('Add Home Address')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
