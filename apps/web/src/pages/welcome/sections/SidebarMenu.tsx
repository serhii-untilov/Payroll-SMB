import { Divider } from '@/components/layout/Divider';
import {
    Box,
    Drawer,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import useSidebarMenu from '../hooks/SidebarMenu.hooks';

type Props = {
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
};

export function SidebarMenu(props: Props) {
    const { menuItems } = useSidebarMenu();
    return (
        <Drawer
            anchor={'right'}
            open={props.showSidebar}
            onClose={() => {
                props.setShowSidebar(false);
            }}
        >
            <Box
                role="presentation"
                onClick={() => {
                    props.setShowSidebar(false);
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
        </Drawer>
    );
}
