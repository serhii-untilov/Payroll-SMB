import * as React from 'react';
import { ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { grey } from '@mui/material/colors';
import { blue } from '@mui/material/colors';

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
                sx={{
                    '&.active': {
                        // color: blue[700],
                        bgcolor: grey[300],
                    },
                    // color: 'black',
                }}
            >
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
