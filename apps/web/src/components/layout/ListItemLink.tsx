import { selectCompactView } from '@/store/slices/compactViewSlice';
import { useAppSelector } from '@/store/store.hooks';
import { ListItem, ListItemProps } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { NavLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Tooltip } from './Tooltip';

interface Props extends ListItemProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    target?: string;
    onClick?: any;
}

const Link = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
    return <NavLink ref={ref} {...props} role={undefined} />;
});

export function ListItemLink(props: Props) {
    const { icon, primary, to, target, onClick } = props;
    const compactView = useAppSelector(selectCompactView);

    return (
        <li>
            <ListItem
                component={Link}
                target={target}
                to={to}
                onClick={onClick}
                sx={{
                    '&.active': {
                        color: (theme) =>
                            theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black,
                        bgcolor: 'primary.main',
                        opacity: 1,
                        borderRadius: '3px',
                        py: [0.5],
                        my: [0.3],
                    },
                    '> .MuiListItemIcon-root': {
                        opacity: 1,
                        minWidth: 39,
                    },
                    '&.active > .MuiListItemIcon-root': {
                        color: (theme) => theme.palette.background.default,
                        opacity: 1,
                        borderRadius: '3px',
                        minWidth: 39,
                        py: [0.5],
                        my: [0.3],
                    },
                    '&:hover': {
                        borderRadius: '3px',
                        py: [0.5],
                        my: [0.3],
                    },
                    transition: 'none',
                    height: 40,
                    py: [0.5],
                    my: [0.3],
                    px: [1],
                    color: (theme) =>
                        theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
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
