import { User } from '@repo/openapi';
import UserDetailsForm from './UserDetailsForm';

type UserDetailsTabProps = {
    user: User;
};

export default function UserDetailsTab(props: UserDetailsTabProps) {
    return <UserDetailsForm {...props} />;
}
