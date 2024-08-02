import useSignIn from '@/hooks/useSignIn';
import { useTranslation } from 'react-i18next';
import { Button } from './layout/Button';

export default function SignInButton() {
    const { t } = useTranslation();
    const { goSignIn } = useSignIn();

    return (
        <Button
            onClick={goSignIn}
            variant="text"
            sx={{
                borderRadius: 3,
                height: 38,
                width: 90,
                px: 2,
                textAlign: 'center',
            }}
        >
            {t('Sign In')}
        </Button>
    );
}
