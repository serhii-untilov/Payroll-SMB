import * as React from 'react';
import { ListItem, Theme, Tooltip, Typography, useTheme } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    description?: string;
    target?: string;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

export function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to, description, target } = props;

    return (
        <li>
            <Tooltip title={description}>
                <ListItem
                    button
                    // dense
                    component={Link}
                    to={to}
                    target={target}
                >
                    {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                    <ListItemText primary={primary} />
                </ListItem>
            </Tooltip>
        </li>
    );
}
