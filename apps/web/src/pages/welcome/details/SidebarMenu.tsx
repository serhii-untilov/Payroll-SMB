import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Divider } from '../../../components/layout/Divider';
import { LoginRounded, PersonRounded, SearchRounded } from '@mui/icons-material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    setShowSidebarMenu: (show: boolean) => void;
    onClickDemo: () => void;
    onClickLogin: () => void;
    onClickRegister: () => void;
};

export function SidebarMenu(props: Props) {
    const { t } = useTranslation();
    const { setShowSidebarMenu } = props;

    const menuItems = useMemo(
        () => [
            { label: t('Demo'), icon: <SearchRounded />, onClick: props.onClickDemo },
            { label: t('Sign Up'), icon: <PersonRounded />, onclick: props.onClickRegister },
            { label: t('Sign In'), icon: <LoginRounded />, onclick: props.onClickLogin },
        ],
        [t, props],
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
                        <ListItemButton onClick={item.onClick}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
