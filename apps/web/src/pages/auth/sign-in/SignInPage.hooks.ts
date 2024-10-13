import { useAuth } from '@/hooks/context/useAuth';
import useLocale from '@/hooks/context/useLocale';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { AppMessage } from '@/types';
import { snackbarError, snackbarFormErrors } from '@/utils/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthDto } from '@repo/openapi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export default function useSignInPage() {
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const { locale } = useLocale();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { invalidateAllQueries } = useInvalidateQueries();

    const formSchema = useMemo(
        () =>
            yup.object().shape({
                email: yup.string().required('Email is required').email('Email is invalid'),
                password: yup.string().required('Password is required'),
                rememberMe: yup.boolean(),
            }),
        [],
    );

    type FormType = yup.InferType<typeof formSchema>;

    const defaultValues = useMemo<FormType>(() => {
        return {
            email: '',
            password: '',
            rememberMe: false,
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

    const onSubmit: SubmitHandler<AuthDto> = useCallback(
        () => async (data: AuthDto) => {
            try {
                await login({ ...data, rememberMe });
                await invalidateAllQueries();
                navigate('/dashboard');
            } catch (e) {
                snackbarError(e as AppMessage);
            }
        },
        [login, rememberMe, invalidateAllQueries, navigate],
    );

    return {
        control,
        handleSubmit,
        onSubmit,
        rememberMe,
        setRememberMe,
    };
}
