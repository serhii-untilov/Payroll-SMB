import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetUserCompanyList } from '@/hooks/queries/useUserCompany';
import { User } from '@repo/openapi';
import { useState } from 'react';
import UserCompanyList from './UserCompanyList';

const UserCompanyTab = ({ user }: { user: User }) => {
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const {
        data: userCompanyList,
        isError,
        isLoading,
        error: error,
    } = useGetUserCompanyList({ userId: user.id, relations: true, withDeleted: showDeleted });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {userCompanyList && <UserCompanyList {...{ user, userCompanyList, showDeleted, setShowDeleted }} />}
        </>
    );
};

export default UserCompanyTab;
