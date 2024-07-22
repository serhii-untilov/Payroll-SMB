import { Link } from '@/components/layout/Link';
import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { capitalizeFirstChar, getPartOfDay } from '@/utils';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function Greeting() {
    const dateTime = new Date();
    const { t } = useTranslation();
    const { data: user, isLoading } = useCurrentUser();
    const userName = useMemo(() => user?.firstName || user?.lastName || user?.email, [user]);

    if (isLoading) return <Loading />;

    return (
        <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
            {t(getPartOfDay(dateTime.getHours()))},{' '}
            <Link to={'/profile?tab=details&return=true'}>{capitalizeFirstChar(userName)}</Link>
        </Typography>
    );
}
