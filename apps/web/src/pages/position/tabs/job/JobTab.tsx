import { Company, PayPeriod, Position, PositionHistory } from '@repo/openapi';
import JobForm from './JobForm';
import { Dispatch } from 'react';

interface JobTabProps {
    company: Company;
    payPeriod: PayPeriod;
    position?: Position | undefined;
    positionHistory?: PositionHistory | undefined;
    setPositionId?: Dispatch<number> | undefined;
}

const JobTab = (props: JobTabProps) => {
    return <JobForm {...props} />;
};

export default JobTab;
