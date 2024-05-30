import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Divider } from '../../../components/layout/Divider';
import { LoginRounded, PersonRounded, SearchRounded } from '@mui/icons-material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    setShowSidebarMenu: (show: boolean) => void;
};

export function SidebarMenu(props: Props) {
    const { t } = useTranslation();
    const { setShowSidebarMenu } = props;

    const menuItems = useMemo(
        () => [
            { label: t('Demo'), icon: <SearchRounded />, href: '/demo' },
            { label: t('Sign Up'), icon: <PersonRounded />, href: '/register' },
            { label: t('Sign In'), icon: <LoginRounded />, href: '/login' },
        ],
        [t],
    );

    return (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => {
                setShowSidebarMenu(false);
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton href={item.href}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
