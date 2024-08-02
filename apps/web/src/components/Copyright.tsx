import { Typography } from '@mui/material';
import { Link } from './layout/Link';

const Copyright = () => {
    return (
        <Link to="https://untilov.com.ua" target="_blank" rel="noreferrer">
            <Typography sx={{ color: 'grey.700', display: 'inline' }}>Copyright © </Typography>
            <Typography sx={{ color: 'primary.main', display: 'inline' }}>
                Serhii Untilov
            </Typography>{' '}
            <Typography sx={{ color: 'grey.700', display: 'inline' }}>
                {new Date().getFullYear()}
            </Typography>
        </Link>
    );
};

export default Copyright;
