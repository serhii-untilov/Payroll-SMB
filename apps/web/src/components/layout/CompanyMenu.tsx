import { useLocale } from '@/hooks/useLocale';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import BusinessCenterOutlined from '@mui/icons-material/BusinessCenterOutlined';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider } from './Divider';
import { ListItemButton } from './ListItemButton';
import { ListItemLink } from './ListItemLink';

type CompanyMenuProps = {
    popupState: any;
};

function CompanyMenu(props: CompanyMenuProps) {
    const { popupState } = props;

    return (
        <Menu
            {...bindMenu(popupState)}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            sx={{ ml: [4.5], mt: [5] }}
        >
            <Typography
                variant="body2"
                color={grey[600]}
                minWidth={270}
                sx={{ p: 1.5, cursor: 'default' }}
            >
                Select company
            </Typography>

            <MenuItem onClick={popupState.close}>Diamond Silence</MenuItem>
            <MenuItem onClick={popupState.close}>Zero Solutions</MenuItem>
            <Divider />
            <MenuItem onClick={popupState.close}>Company list</MenuItem>
            <Divider />
            <ListItemLink to="/companies-new" primary="New company" onClick={popupState.close} />
        </Menu>
    );
}

export function CompanyListItem() {
    const { locale } = useLocale();
    const { t } = useTranslation();

    useEffect(() => {}, [locale]);

    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <Fragment>
                    <ListItemButton
                        {...bindTrigger(popupState)}
                        primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                {t('Company')}
                                <ArrowDropDown sx={{ ml: [0.5] }} />
                            </Box>
                        }
                        icon={<BusinessCenterOutlined />}
                    />
                    <CompanyMenu popupState={popupState} />
                </Fragment>
            )}
        </PopupState>
    );
}
