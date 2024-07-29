import ErrorDisplay from '@/components/utility/ErrorDisplay';
import { LoadingDisplay } from '@/components/utility/LoadingDisplay';
import useUserCompanies from '@/hooks/queries/useUserCompanies';
import { User } from '@repo/openapi';
import { useState } from 'react';

type Props = {
    user: User;
};

export function UserCompanyList({ user }: Props) {
    const [showDeleted, setShowDeleted] = useState<boolean>(false);
    const {
        data: userCompanies,
        isError,
        isLoading,
        error: error,
    } = useUserCompanies({ userId: user.id, relations: true, withDeleted: showDeleted });

    return (
        <>
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {userCompanies && (
                <UserCompanyList {...{ user, userCompanies, showDeleted, setShowDeleted }} />
            )}
        </>
    );
}
