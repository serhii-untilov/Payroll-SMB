import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { FormDateField } from '../../../components/form/FormDateField';
import { FormTextField } from '../../../components/form/FormTextField';
import TabLayout from '../../../components/layout/TabLayout';
import { Toolbar } from '../../../components/layout/Toolbar';
import useAppContext from '../../../hooks/useAppContext';
import useLocale from '../../../hooks/useLocale';
import { getPerson } from '../../../services/person.service';
import { createPerson, updatePerson } from '../../../services/person.service';
import { getDirtyValues } from '../../../services/utils';

interface Props {
    personId: number | null;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    middleName: yup.string().nullable(),
    taxId: yup.string().nullable(),
    birthDate: yup.date().nullable(),
    sex: yup.string().nullable(),
    phone: yup.string().nullable(),
    email: yup.string().nullable(),
    photo: yup.string().nullable(),
    deletedUserId: yup.number().nullable(),
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
        birthDate: null,
        taxId: '',
        sex: '',
        phone: '',
        email: '',
        photo: '',
    };

    const {
        data: person,
        isError: isPersonError,
        error: personError,
    } = useQuery<FormType, Error>({
        queryKey: ['person', personId],
        queryFn: async () => {
            return formSchema.cast(personId ? await getPerson(personId) : defaultValues);
        },
        enabled: !!company?.id,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: person || defaultValues,
        values: person || defaultValues,
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

    if (isPersonError) {
        return enqueueSnackbar(`${personError.name}\n${personError.message}`, {
            variant: 'error',
        });
    }
    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) {
            reset(person);
        }
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const person = data.id
                ? await updatePerson(data.id, dirtyValues)
                : await createPerson(data);
            reset(person);
            queryClient.invalidateQueries({ queryKey: ['person', personId] });
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onSave = () => {
        handleSubmit(onSubmit);
    };

    const onCancel = () => {
        reset(defaultValues);
        queryClient.invalidateQueries({ queryKey: ['person', personId] });
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
                    onSave={isDirty ? onSave : 'disabled'}
                    onCancel={isDirty ? onCancel : 'disabled'}
                    onPrint={person?.id ? onPrint : 'disabled'}
                    onExport={person?.id ? onExport : 'disabled'}
                    onDelete={person?.id ? onDelete : 'disabled'}
                    onRestoreDeleted={person?.deletedUserId ? onRestoreDeleted : 'disabled'}
                />

                <Grid container xs={12} spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormTextField
                            control={control}
                            autoComplete="last-name"
                            name="lastName"
                            id="lastName"
                            label={t('Last Name')}
                            type="text"
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
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
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
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
                            autoFocus
                            sx={{ fontWeight: 'bold' }}
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
                            name="birthDate"
                            id="birthDate"
                            label={t('Birth Date')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormTextField
                            control={control}
                            name="sex"
                            id="sex"
                            label={t('Sex')}
                            type="text"
                        />
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
                            type="number"
                        />
                    </Grid>
                </Grid>
            </TabLayout>
        </>
    );
}
