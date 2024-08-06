import { Link } from '@/components/layout/Link';
import { Typography } from '@mui/material';

const CompanyName = ({ company }) => {
    return (
        <Link to={`/company/${company.id}?tab-index=0&return=true`}>
            <Typography variant="h3" color="primary">
                {company.name}
            </Typography>
        </Link>
    );
};
export default CompanyName;
