import { ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';
import { Tooltip } from './Tooltip';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    target?: string;
    onClick?: any;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
    return <NavLink ref={ref} {...props} role={undefined} />;
});

export function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to, target, onClick } = props;
    const { compactView } = useAppContext();

    return (
        <li>
            <ListItem
                button
                component={Link}
                target={target}
                to={to}
                onClick={onClick}
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
                        disableFocusListener={!compactView}
                        disableHoverListener={!compactView}
                        disableInteractive={!compactView}
                        disableTouchListener={!compactView}
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
