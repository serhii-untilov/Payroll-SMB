import React from 'react';
import { RouteComponentProps } from 'react-router';

interface UserPageProps
    extends RouteComponentProps<{
        id: string;
    }> {}

const User: React.FC<UserPageProps> = ({ match }, props) => {
    const { id } = match.params;

    return (
        <div>
            <h1>User Page</h1>
            <p>ID: {id}</p>
        </div>
    );
};

export default User;
