import { Link } from '@/components/layout/Link';
import { Typography } from '@mui/material';
import { Company } from '@repo/openapi';

type CompanyNameProps = {
    company: Company;
};

const CompanyName = ({ company }: CompanyNameProps) => {
    return (
        <Link to={`/company/${company.id}?tab=details&return=true`}>
            <Typography variant="h3" color="primary">
                {company.name}
            </Typography>
        </Link>
    );
};

export default CompanyName;
