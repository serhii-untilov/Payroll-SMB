import { useAuth } from '@/hooks/context/useAuth';
import { demo } from '@/services/auth/auth.service';
import { Button } from '@mui/material';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

export default function DemoButton() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const onClickDemo = async () => {
        const credentials = await demo();
        await login(credentials);
        navigate('/dashboard');
    };

    return (
        <Button
            onClick={onClickDemo}
            variant="contained"
            color="primary"
            sx={{
                display: { xs: 'block', sm: 'none', md: 'none' },
                borderRadius: 3,
                height: 38,
                width: 90,
                px: 2,
                my: 1,
                textAlign: 'center',
            }}
        >
            {t('Demo')}
        </Button>
    );
}
