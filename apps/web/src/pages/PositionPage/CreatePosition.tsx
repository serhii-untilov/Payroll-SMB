import { Company } from '@repo/openapi';
import { Dispatch } from 'react';
import PositionForm from './PositionForm';

interface CreatePositionProps {
    company: Company;
    setPositionId: Dispatch<number>;
}

export default function CreatePosition(props: CreatePositionProps) {
    return (
        <PositionForm company={props.company} goBack={true} setPositionId={props.setPositionId} />
    );
}
