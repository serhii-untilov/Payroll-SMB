import { t } from 'i18next';
import { FormTextField } from './form/FormTextField';
import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

type PasswordFieldProps = {
    control: any;
    autoFocus?: boolean;
    sx?: any;
};

export default function PasswordField(props: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormTextField
            sx={props.sx}
            autoFocus={!!props.autoFocus}
            control={props.control}
            required
            id="password"
            name="password"
            label={t('Password')}
            type={showPassword ? 'text' : 'password'}
            rules={{
                required: true,
            }}
            autoComplete="current-password"
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        sx={{ color: grey[600] }}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            }
        />
    );
}
