import { Link } from '@/components/layout/Link';
import Error from '@/components/utility/Error';
import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/queries/useCurrentUser';
import { getPartOfDay } from '@/utils/getPartOfDay';
import { getUserName } from '@/utils/getUserName';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function GreetingUser() {
    const { data: user, isLoading, isError, error } = useCurrentUser();
    const { t } = useTranslation();

    return (
        <>
            {isError && <Error error={error} />}
            {isLoading && <Loading />}
            {user && (
                <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
                    {t(getPartOfDay(new Date().getHours()))},{' '}
                    <Link to={'/profile?tab-index=0&return=true'}>{getUserName(user)}</Link>
                </Typography>
            )}
        </>
    );
}
