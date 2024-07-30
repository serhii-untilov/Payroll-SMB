import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import { useCurrentUser } from '@/hooks/queries/useCurrentUser';
import { useSearchParams } from 'react-router-dom';
import ProfileForm from './ProfileForm';

export default function UserProfilePage() {
    const [searchParams] = useSearchParams();
    const tabIndex = searchParams.get('tab-index');
    const goBack = searchParams.get('return') === 'true';
    const { data: user, isLoading, isError, error } = useCurrentUser();

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay {...{ error }} />}
            {user && <ProfileForm {...{ user, tabIndex, goBack }} />}
        </>
    );
}
