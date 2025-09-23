import { Typography } from '@mui/material';
import { Link } from './layout/Link';
import { Author, Website } from '@/constants';

const Copyright = () => {
    return (
        <Link to={Website} target="_blank" rel="noreferrer">
            <Typography sx={{ color: 'grey.700', display: 'inline' }}>Copyright © </Typography>
            <Typography sx={{ color: 'primary.main', display: 'inline' }}>{Author}</Typography>{' '}
            <Typography sx={{ color: 'grey.700', display: 'inline' }}>
                2024 - {new Date().getFullYear()}
            </Typography>
        </Link>
    );
};

export default Copyright;
