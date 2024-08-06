import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetCurrentUser } from '@/hooks/queries/useUser';
import { useSearchParams } from 'react-router-dom';
import UserForm from './UserForm';

const UserPage = () => {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { data: user, isLoading, isError, error } = useGetCurrentUser();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay {...{ error }} />}
            {user && <UserForm {...{ user, tabIndex, goBack }} />}
        </>
    );
};

export default UserPage;
