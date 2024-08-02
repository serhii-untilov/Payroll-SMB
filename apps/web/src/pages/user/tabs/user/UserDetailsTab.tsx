import UserDetailsForm from './UserDetailsForm';

const UserDetailsTab = ({ user }) => {
    return <UserDetailsForm {...{ user }} />;
};

export default UserDetailsTab;
