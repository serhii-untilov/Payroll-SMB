import {
    ArrowRightRounded,
    DarkModeOutlined,
    Language,
    LayersRounded,
    LightModeOutlined,
    ListRounded,
    LoginRounded,
    PersonRounded,
    ScreenshotMonitorRounded,
    SearchRounded,
    TurnedInNotRounded,
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
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider } from '../../../components/layout/Divider';
import useLocale from '../../../hooks/useLocale';
import useAppContext from '../../../hooks/useAppContext';

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
                icon: <ArrowRightRounded />, // <ListRounded />,
                href: '#features',
            },
            {
                label: t('Usage scenarios'),
                icon: <ArrowRightRounded />, // <LayersRounded />,
                href: '#usage-scenarios',
            },
            {
                label: t('Screenshots'),
                icon: <ArrowRightRounded />, // <ScreenshotMonitorRounded />,
                href: '#screenshot-list',
            },
            { label: 'divider' },
            {
                label: themeMode === 'light' ? t('Light theme') : t('Dark theme'),
                icon: themeMode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />,
                onClick: switchThemeMode,
            },
        ],
        [t, props],
    );

    return (
        <Box
            // sx={{ minWidth: 320 }}
            role="presentation"
            onClick={() => {
                setShowSidebarMenu(false);
            }}
        >
            <List>
                {menuItems.map((item) =>
                    item?.label === 'divider' ? (
                        <Divider component="li" />
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
