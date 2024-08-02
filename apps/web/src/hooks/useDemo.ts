import { demo } from '@/services/auth/auth.service';
import { useAuth } from './context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function useDemo() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const goDemo = async () => {
        const credentials = await demo();
        await login(credentials);
        navigate('/dashboard');
    };

    return { goDemo };
}
