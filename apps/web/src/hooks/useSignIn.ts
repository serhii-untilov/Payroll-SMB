import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

export default function useSignIn() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const goSignIn = async () => {
        await logout();
        navigate('/signin');
    };

    return { goSignIn };
}
