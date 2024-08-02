import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useUserCompanies from '@/hooks/queries/useUsers';
import { useState } from 'react';
import UserCompanyList from './UserCompanyList';

const UserCompanyTab = ({ user }) => {
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const {
        data: userCompanyList,
        isError,
        isLoading,
        error: error,
    } = useUserCompanies({ userId: user.id, relations: true, withDeleted: showDeleted });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {userCompanyList && (
                <UserCompanyList {...{ user, userCompanyList, showDeleted, setShowDeleted }} />
            )}
        </>
    );
};

export default UserCompanyTab;
