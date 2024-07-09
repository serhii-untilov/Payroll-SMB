import { Link } from '@/components/layout/Link';
import { Loading } from '@/components/utility/Loading';
import useAuth from '@/hooks/useAuth';
import { getCurrentUser } from '@/services/auth.service';
import { capitalizeFirstChar, getPartOfDay } from '@/services/utils';
import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function Greeting() {
    const { user: currentUser } = useAuth();
    const dateTime = new Date();
    const { t } = useTranslation();

    const {
        data: user,
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user', { id: currentUser?.id }],
        queryFn: async () => {
            return await getCurrentUser();
        },
    });

    const userName = useMemo(() => user?.firstName || user?.lastName || user?.email, [user]);

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return enqueueSnackbar(`${error.name}\n${error.message}`, { variant: 'error' });
    }

    return (
        <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
            {t(getPartOfDay(dateTime.getHours()))},{' '}
            <Link to={'/profile?tab=details&return=true'}>{capitalizeFirstChar(userName)}</Link>
        </Typography>
    );
}
