import * as React from 'react';
import { ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

interface ListItemButtonProps {
    icon?: React.ReactElement;
    primary: string;
    onClick: React.MouseEventHandler;
}

export function ListItemButton(props: ListItemButtonProps) {
    const { icon, primary, onClick } = props;

    return (
        <li>
            <ListItem
                button
                // dense
                component="button"
                onClick={onClick}
            >
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
