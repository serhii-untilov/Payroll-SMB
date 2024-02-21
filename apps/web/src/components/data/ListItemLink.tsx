import { Box, ListItem, Typography, styled } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { grey } from '@mui/material/colors';

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

    return (
        <li>
            <ListItem
                button
                // dense
                component={Link}
                target={target}
                to={to}
                sx={{
                    '&.active': {
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
