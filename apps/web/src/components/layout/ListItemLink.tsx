import { useState, useEffect } from 'react';
import { ListItem, Tooltip, useMediaQuery } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    target?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
    return <NavLink ref={ref} {...props} role={undefined} />;
});

export function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to, target } = props;
    const [compactSidebar, setCompactSidebar] = useState(true);
    const matches = useMediaQuery('(min-width:900px)');

    useEffect(() => {
        setCompactSidebar(!matches);
    }, [matches]);

    return (
        <li>
            <ListItem
                button
                component={Link}
                target={target}
                to={to}
                sx={{
                    '&.active': {
                        color: 'white',
                        bgcolor: 'primary.main',

                        opacity: 0.85,
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    '> .css-cveggr-MuiListItemIcon-root': {
                        minWidth: 39,
                    },
                    '&.active > .css-cveggr-MuiListItemIcon-root': {
                        color: 'white',
                        opacity: 0.85,
                        borderRadius: '5px',
                        minWidth: 39,
                        py: [0.5],
                        my: [0.3],
                    },
                    '&:hover': {
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    height: 40,
                    transition: 'none',
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
                        <ListItemIcon>{icon}</ListItemIcon>
                    </Tooltip>
                ) : null}

                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
