import { IPublicUserData } from '@repo/shared';
import { enqueueSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import PageLayout from '../components/layout/PageLayout';
import { Loading } from '../components/utility/Loading';
import { getCurrentUser } from '../services/auth.service';

export default function Profile() {
    const {
        data: user,
        isError,
        isSuccess,
        isLoading,
        error,
    } = useQuery<IPublicUserData | null, Error>('user-profile', getCurrentUser);

    if (isError) {
        enqueueSnackbar(`${error.name}\n${error.message}`, { variant: 'error' });
    }

    if (isSuccess) {
        if (!user) {
            enqueueSnackbar('User not found.', { variant: 'error' });
            return <></>;
        }
        return (
            <PageLayout title="User's Profile">
                <h2>{user?.firstName}</h2>
                <h2>{user?.lastName}</h2>
                <h2>{user?.email}</h2>
            </PageLayout>
        );
    }

    return (
        <>
            <Loading />
        </>
    );
}
