import { ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';
import { Tooltip } from './Tooltip';
import { grey } from '@mui/material/colors';

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
                        color: (theme) =>
                            theme.palette.mode === 'dark'
                                ? theme.palette.background.default
                                : theme.palette.text.primary,
                        // bgcolor: (theme) => theme.palette.primary.main,
                        bgcolor: (theme) => grey[300],
                        // opacity: 0.85,
                        borderRadius: '5px',
                        py: [0.5],
                        my: [0.3],
                    },
                    '> .MuiListItemIcon-root': {
                        opacity: 0.85,
                        minWidth: 39,
                    },
                    '&.active > .MuiListItemIcon-root': {
                        color: (theme) =>
                            theme.palette.mode === 'dark'
                                ? theme.palette.background.default
                                : theme.palette.text.primary,
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
                    transition: 'none',
                    height: 40,
                    // opacity: 0.85,
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
                        <ListItemIcon sx={{ minWidth: 39 }}>{icon}</ListItemIcon>
                    </Tooltip>
                ) : null}

                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
