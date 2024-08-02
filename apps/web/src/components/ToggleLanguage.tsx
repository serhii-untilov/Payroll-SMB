import useLocale from '@/hooks/context/useLocale';
import { Language } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export default function ToggleLanguage() {
    const { toggleLanguage } = useLocale();
    return (
        <IconButton
            color="primary"
            onClick={() => {
                toggleLanguage();
            }}
        >
            <Language />
        </IconButton>
    );
}
