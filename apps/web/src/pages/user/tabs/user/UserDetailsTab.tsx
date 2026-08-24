import { User } from '@repo/openapi';
import UserDetailsForm from './UserDetailsForm';

const UserDetailsTab = ({ user }: { user: User }) => {
    return <UserDetailsForm {...{ user }} />;
};

export default UserDetailsTab;
