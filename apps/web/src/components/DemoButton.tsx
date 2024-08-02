import useDemo from '@/hooks/useDemo';
import { Button } from '@mui/material';
import { t } from 'i18next';

const DemoButton = () => {
    const { goDemo } = useDemo();
    return (
        <Button
            onClick={goDemo}
            variant="contained"
            color="primary"
            sx={{
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
};

export default DemoButton;
