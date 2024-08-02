import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import { errorMessage } from '@/utils/errorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateUserDto } from '@repo/openapi';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function useSignUpPage() {
    const { register } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const formSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().required('Email is required').email('Email is invalid'),
        password: Yup.string().required('Password is required'),
        // roles: Yup.array().required('Role is required'),
    });

    type FormType = Yup.InferType<typeof formSchema>;

    const defaultValues: FormType = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        values: defaultValues,
        defaultValues: defaultValues,
        resolver: yupResolver(formSchema),
        shouldFocusError: true,
    });

    useEffect(() => {}, [locale]);

    useEffect(() => {
        errors.firstName?.message &&
            enqueueSnackbar(t(errors.firstName?.message), { variant: 'error' });
        errors.lastName?.message &&
            enqueueSnackbar(t(errors.lastName?.message), { variant: 'error' });
        errors.email?.message && enqueueSnackbar(t(errors.email?.message), { variant: 'error' });
        errors.password?.message &&
            enqueueSnackbar(t(errors.password?.message), { variant: 'error' });
    }, [errors, t]);

    const onSubmit: SubmitHandler<CreateUserDto> = async (data) => {
        console.log(data);
        if (data.email) {
            try {
                await register(data);
                navigate('/dashboard');
            } catch (e) {
                enqueueSnackbar(t(errorMessage(e)), { variant: 'error' });
            }
        }
    };

    return {
        control,
        handleSubmit,
        onSubmit,
    };
}
