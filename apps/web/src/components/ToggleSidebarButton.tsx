import { MenuRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Dispatch } from 'react';

type Props = {
    setShowSidebar: Dispatch<boolean>;
};

export default function ToggleSidebarButton(props: Props) {
    return (
        <IconButton
            id="header__menu-button"
            onClick={() => props.setShowSidebar(true)}
            sx={{ color: 'primary.main' }}
        >
            <MenuRounded />
        </IconButton>
    );
}
