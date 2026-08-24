import { Link } from '@/components/layout/Link';
import { useUserFirstName } from '@/hooks/useUserName';
import { getPartOfDay } from '@/utils/getPartOfDay';
import { PublicUserDataDto, User } from '@repo/openapi';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    user: PublicUserDataDto | null | undefined;
};

const GreetingUser = ({ user }: Props) => {
    const { t } = useTranslation();
    const userName = useUserFirstName((user ?? undefined) as User | undefined);
    const hours = new Date().getHours();
    const partOfDay = useMemo(() => t(getPartOfDay(hours)), [hours, t]);

    return (
        <>
            {user && (
                <Typography component="h2" variant="h1" textAlign={'center'} sx={{ my: 2 }}>
                    {partOfDay}, <Link to={'/profile?tab-index=0&return=true'}>{userName}</Link>
                </Typography>
            )}
        </>
    );
};

export default GreetingUser;
