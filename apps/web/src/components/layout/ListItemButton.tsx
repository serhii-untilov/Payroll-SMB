import { ListItem, Tooltip, useMediaQuery } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';

interface ListItemButtonProps {
    icon?: React.ReactElement;
    primary: string;
    onClick: React.MouseEventHandler;
}

export function ListItemButton(props: ListItemButtonProps) {
    const { icon, primary, onClick } = props;
    const [compactSidebar, setCompactSidebar] = useState(true);
    const matches = useMediaQuery('(min-width:900px)');

    useEffect(() => {
        setCompactSidebar(!matches);
    }, [matches]);

    return (
        <li>
            <ListItem
                button
                // dense
                component="button"
                onClick={onClick}
                sx={{
                    '&.active': {
                        color: 'white',
                        bgcolor: 'primary.main',
                        backgroundColor: 'primary.main',
                        opacity: 0.85,
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    '&.active > .css-cveggr-MuiListItemIcon-root': {
                        color: 'white',
                        bgcolor: 'primary.main',
                        backgroundColor: 'primary.main',
                        opacity: 0.85,
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    '&:hover': {
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    transition: 'none',
                    height: 40,
                    py: [0.5],
                    my: [0.3],
                    px: [1],
                }}
            >
                {icon ? (
                    <Tooltip
                        disableFocusListener={!compactSidebar}
                        disableHoverListener={!compactSidebar}
                        disableInteractive={!compactSidebar}
                        disableTouchListener={!compactSidebar}
                        placement="right"
                        title={primary}
                    >
                        <ListItemIcon sx={{ minWidth: 39 }}>{icon}</ListItemIcon>
                    </Tooltip>
                ) : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
