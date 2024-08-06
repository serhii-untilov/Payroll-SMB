import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

export default function useSignUp() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const goSignUp = async () => {
        await logout();
        navigate('/signup');
    };

    return { goSignUp };
}
