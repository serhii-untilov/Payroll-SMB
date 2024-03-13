import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IDepartment } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/layout/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from 'react-query';
import {
    createDepartment,
    getDepartment,
    updateDepartment,
} from '../../services/department.service';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { Dispatch, FormEvent, Fragment, useEffect, useState } from 'react';
import useLocale from '../../hooks/useLocale';
import { enqueueSnackbar } from 'notistack';
import { maxDate, minDate } from '@repo/utils';
import { Loading } from '../../components/utility/Loading';
import { getDirtyValues } from '../../services/utils';
import { AxiosError } from 'axios';
// import { maxDate, minDate } from '@repo/utils';

export interface DepartmentFormParams {
    open: boolean;
    setOpen: Dispatch<boolean>;
    departmentId: number | null;
}

const formSchema = yup.object().shape({
    id: yup.number().nullable(),
    name: yup.string().required('Name is required'),
    companyId: yup.number().positive('Company is required').required(),
    dateFrom: yup.date().required('DateFrom is required'),
    dateTo: yup.date().required('DateTo is required'),
    parentDepartmentId: yup.number().nullable(),
});

type FormType = yup.InferType<typeof formSchema>;

// To prevent Warning: A component is changing an uncontrolled input to be controlled.
const defaultValues: FormType = {
    id: null,
    name: '',
    companyId: 0,
    dateFrom: minDate(),
    dateTo: maxDate(),
    parentDepartmentId: null,
};

export default function DepartmentForm(params: DepartmentFormParams) {
    const [departmentId, setDepartmentId] = useState(params.departmentId);
    const { locale } = useLocale();
    const { t } = useTranslation();

    const {
        data: department,
        isError: isDepartmentError,
        isLoading: isDepartmentLoading,
        error: departmentError,
    } = useQuery<FormType, Error>('department', async () => {
        return formSchema.cast(departmentId ? await getDepartment(departmentId) : defaultValues);
    });

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors: formErrors },
    } = useForm({
        defaultValues: department || defaultValues,
        values: department || defaultValues,
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

    if (isDepartmentLoading) {
        return <Loading />;
    }

    if (isDepartmentError) {
        setDepartmentId(null);
        return enqueueSnackbar(`${departmentError.name}\n${departmentError.message}`, {
            variant: 'error',
        });
    }

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        if (!isDirty) return;
        const dirtyValues = getDirtyValues(dirtyFields, data);
        try {
            const department = data.id
                ? await updateDepartment(data.id, dirtyValues)
                : await createDepartment(data);
            reset(department);
            setDepartmentId(department.id);
        } catch (e: unknown) {
            const error = e as AxiosError;
            enqueueSnackbar(`${error.code}\n${error.message}`, { variant: 'error' });
        }
    };

    const onCancel = () => {
        reset(department);
    };
    return (
        <Fragment>
            <Dialog
                open={params.open}
                onClose={() => {
                    params.setOpen(false);
                }}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const email = formJson.email;
                        console.log(email);
                        params.setOpen(false);
                    },
                }}
            >
                <DialogTitle>{t('Department')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will
                        send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions sx={{ my: 1 }}>
                    <Button
                        onClick={() => {
                            params.setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
