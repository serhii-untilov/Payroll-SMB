import { selectThemeMode } from '@/store/slices/themeModeSlice';
import { useAppSelector } from '@/store/store.hooks';

export default function useHeader() {
    const themeMode = useAppSelector(selectThemeMode);

    const headerProps = {
        maxWidth: 'lg',
        width: '100%',
        px: { xs: 1, sm: 2 },
        display: 'flex',
        justifyContent: 'space-between',
    };

    const backGroundProps = {
        maxWidth: 'lg',
        width: '100%',
        my: 'auto',
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        align: 'center',
        borderRadius: 25,
        /* From https://css.glass */
        background: themeMode === 'light' ? 'rgba(255, 255, 255, 0.6)' : '',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(25, 118, 210, 0.3)',
    };

    return { backGroundProps, headerProps };
}
