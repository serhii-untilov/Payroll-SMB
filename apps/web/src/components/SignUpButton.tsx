import useSignUp from '@/hooks/useSignUp';
import { useTranslation } from 'react-i18next';
import { Button } from './layout/Button';

export default function SignUpButton() {
    const { t } = useTranslation();
    const { goSignUp } = useSignUp();

    return (
        <Button
            onClick={goSignUp}
            variant="text"
            sx={{
                borderRadius: 3,
                width: 120,
                height: 38,
                px: 2,
                my: 1,
                textAlign: 'center',
            }}
        >
            {t('Sign Up')}
        </Button>
    );
}
