import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { AppMessage } from '@/types';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateUserDto } from '@repo/openapi';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function useSignUpPage() {
    const { register } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { invalidateAllQueries } = useInvalidateQueries();

    const formSchema = useMemo(
        () =>
            Yup.object().shape({
                firstName: Yup.string().required('First name is required'),
                lastName: Yup.string().required('Last name is required'),
                email: Yup.string().required('Email is required').email('Email is invalid'),
                password: Yup.string().required('Password is required'),
                // roles: Yup.array().required('Role is required'),
            }),
        [],
    );

    type FormType = Yup.InferType<typeof formSchema>;

    const defaultValues = useMemo<FormType>(() => {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        };
    }, []);

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
    useEffect(() => snackbarFormErrors(t, errors), [errors, t]);

    const onSubmit: SubmitHandler<CreateUserDto> = useCallback(
        async (data) => {
            console.log(data);
            if (data.email) {
                try {
                    await register(data);
                    await invalidateAllQueries();
                    navigate('/dashboard');
                } catch (e) {
                    snackbarError(e as AppMessage);
                }
            }
        },
        [invalidateAllQueries, navigate, register],
    );

    return {
        control,
        handleSubmit,
        onSubmit,
    };
}
