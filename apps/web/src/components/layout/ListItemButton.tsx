import { ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useAppContext from '../../hooks/useAppContext';
import { Tooltip } from './Tooltip';

interface ListItemButtonProps {
    icon?: React.ReactElement;
    primary: string | React.ReactElement;
    onClick?: React.MouseEventHandler;
}

export function ListItemButton(props: ListItemButtonProps) {
    const { icon, primary, onClick } = props;
    const { compactView } = useAppContext();

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
                        bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                                ? theme.palette.primary.dark
                                : theme.palette.primary.main,
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
