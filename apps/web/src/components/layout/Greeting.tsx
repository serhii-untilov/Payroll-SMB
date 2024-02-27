import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import { capitalizeFirstChar, getPartOfDay } from '../../services/utils';

export function Greeting() {
    const { user } = useAuth();
    const userName = user?.firstName || user?.lastName || user?.email;
    const dateTime = new Date();
    const { t } = useTranslation();
    return (
        <>
            {t(getPartOfDay(dateTime.getHours()))}, {capitalizeFirstChar(userName)}
        </>
    );
}
