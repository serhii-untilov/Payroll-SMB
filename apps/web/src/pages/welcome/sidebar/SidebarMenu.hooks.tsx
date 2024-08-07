import useLocale from '@/hooks/context/useLocale';
import useDemo from '@/hooks/useDemo';
import useSignIn from '@/hooks/useSignIn';
import useSignUp from '@/hooks/useSignUp';
import { selectThemeMode, switchThemeMode } from '@/store/slices/themeModeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store.hooks';
import {
    ArrowRightRounded,
    DarkModeOutlined,
    Language,
    LightModeOutlined,
    LoginRounded,
    PersonRounded,
    SearchRounded,
} from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useSidebarMenu = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const themeMode = useAppSelector(selectThemeMode);
    const dispatch = useAppDispatch();
    const { goDemo } = useDemo();
    const { goSignIn } = useSignIn();
    const { goSignUp } = useSignUp();
    const { toggleLanguage } = useLocale();
    const onChangeThemeMode = useCallback(() => dispatch(switchThemeMode()), [dispatch]);

    const menuItems = useMemo(
        () => [
            {
                label: locale.language === 'en' ? 'Українська' : 'English',
                icon: <Language />,
                onClick: toggleLanguage,
            },
            { label: 'divider' },
            { label: t('Demo'), icon: <SearchRounded />, onClick: goDemo },
            { label: t('Sign Up'), icon: <PersonRounded />, onclick: goSignUp },
            { label: t('Sign In'), icon: <LoginRounded />, onclick: goSignIn },
            { label: 'divider' },
            {
                label: t('Main features'),
                icon: <ArrowRightRounded />,
                href: '#features',
            },
            {
                label: t('Usage scenarios'),
                icon: <ArrowRightRounded />,
                href: '#usage-scenarios',
            },
            {
                label: t('Screenshots'),
                icon: <ArrowRightRounded />,
                href: '#screenshot-list',
            },
            { label: 'divider' },
            {
                label: themeMode === 'light' ? t('Light theme') : t('Dark theme'),
                icon: themeMode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />,
                onClick: onChangeThemeMode,
            },
        ],
        [
            goDemo,
            goSignIn,
            goSignUp,
            locale.language,
            onChangeThemeMode,
            t,
            themeMode,
            toggleLanguage,
        ],
    );

    return { menuItems };
};

export default useSidebarMenu;
