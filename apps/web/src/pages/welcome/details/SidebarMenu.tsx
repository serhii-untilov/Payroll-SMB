import { Divider } from '@/components/layout/Divider';
import { useAppContext } from '@/hooks/useAppContext';
import { useLocale } from '@/hooks/useLocale';
import {
    ArrowRightRounded,
    DarkModeOutlined,
    Language,
    LightModeOutlined,
    LoginRounded,
    PersonRounded,
    SearchRounded,
} from '@mui/icons-material';
import {
    Box,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    setShowSidebarMenu: (show: boolean) => void;
    onClickDemo: () => void;
    onClickLogin: () => void;
    onClickRegister: () => void;
    onClickLanguage: () => void;
};

export function SidebarMenu(props: Props) {
    const { t } = useTranslation();
    const { setShowSidebarMenu } = props;
    const { locale } = useLocale();
    const { themeMode, switchThemeMode } = useAppContext();

    const menuItems = useMemo(
        () => [
            {
                label: locale.language === 'en' ? 'Українська' : 'English',
                icon: <Language />,
                onClick: props.onClickLanguage,
            },
            { label: 'divider' },
            { label: t('Demo'), icon: <SearchRounded />, onClick: props.onClickDemo },
            { label: t('Sign Up'), icon: <PersonRounded />, onclick: props.onClickRegister },
            { label: t('Sign In'), icon: <LoginRounded />, onclick: props.onClickLogin },
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
                onClick: switchThemeMode,
            },
        ],
        [t, props, locale, switchThemeMode, themeMode],
    );

    return (
        <Box
            role="presentation"
            onClick={() => {
                setShowSidebarMenu(false);
            }}
        >
            <List>
                {menuItems.map((item, index) =>
                    item?.label === 'divider' ? (
                        <Divider key={index} component="li" />
                    ) : (
                        <ListItem key={item.label} disablePadding>
                            <Link href={item.href} underline="none">
                                <ListItemButton
                                    onClick={item.onClick}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ),
                )}
            </List>
        </Box>
    );
}
