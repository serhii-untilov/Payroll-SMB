import { Company, Position, PositionHistory } from '@repo/openapi';
import JobForm from './JobForm';
import { Dispatch } from 'react';

interface JobTabProps {
    company: Company;
    position?: Position | undefined;
    positionHistory?: PositionHistory | undefined;
    setPositionId?: Dispatch<number> | undefined;
}

export default function JobTab(props: JobTabProps) {
    return <JobForm {...props} />;
}
