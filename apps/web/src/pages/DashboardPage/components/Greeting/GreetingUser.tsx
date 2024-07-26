import { Link } from '@/components/layout/Link';
import { getPartOfDay } from '@/utils/getPartOfDay';
import { getUserName } from '@/utils/getUserName';
import { Typography } from '@mui/material';
import { User } from '@repo/openapi';
import { useTranslation } from 'react-i18next';

type Props = {
    user: User;
};

export default function GreetingUser({ user }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
                {t(getPartOfDay(new Date().getHours()))},{' '}
                <Link to={'/profile?tab=details&return=true'}>{getUserName(user)}</Link>
            </Typography>
        </>
    );
}
