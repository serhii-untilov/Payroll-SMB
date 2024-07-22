import { useAuth } from '@/hooks';
import PropTypes from 'prop-types';
import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
    children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return;
    }

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

GuestGuard.propTypes = {
    children: PropTypes.node,
};

export default GuestGuard;
