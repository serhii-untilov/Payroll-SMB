import { Checkbox, FormControlLabel } from '@mui/material';
import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    checked: boolean;
    setRememberMe: Dispatch<boolean>;
    sx?: any;
};

const RememberMe = (props: Props) => {
    const { t } = useTranslation();
    return (
        <FormControlLabel
            sx={props.sx}
            control={
                <Checkbox
                    checked={props.checked}
                    color="primary"
                    onChange={(event) => {
                        props.setRememberMe(event.target.checked);
                    }}
                />
            }
            label={t('Remember me')}
        />
    );
};

export default RememberMe;
