import { Loading } from '@/components/utility/Loading';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import GreetingUser from './GreetingUser';
import Error from '@/components/utility/Error';

export default function Greeting() {
    const { data: user, isLoading, isError, error } = useCurrentUser();

    return (
        <>
            {isError && <Error error={error} />}
            {isLoading && <Loading />}
            {user && <GreetingUser user={user} />}
        </>
    );
}
