import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentUser } from '@/hooks/queries/useCurrentUser';
import { useSearchParams } from 'react-router-dom';
import UserForm from './UserForm';

export default function UserPage() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { data: user, isLoading, isError, error } = useCurrentUser();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay {...{ error }} />}
            {user && <UserForm {...{ user, tabIndex, goBack }} />}
        </>
    );
}
