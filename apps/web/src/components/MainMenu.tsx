import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Divider, List, ListItem } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { BusinessCenter, Description, People, Logout, Person } from '@mui/icons-material';

export function MainMenu() {
    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemLink to="/company" primary="Company" icon={<BusinessCenter />} />
            <ListItemLink to="/employees" primary="Employees" icon={<People />} />
            <ListItemLink to="/payroll-sheet" primary="Payroll" icon={<Description />} />
            <Divider sx={{ my: 1 }} />
            <ListItemLink to="/profile" primary="Profile" icon={<Person />} />
            <ListItemLink to="/logout" primary="Logout" icon={<Logout />} />
        </List>
    );
}

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;

    return (
        <li>
            <ListItem button component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
