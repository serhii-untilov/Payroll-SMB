import { Dispatch } from 'react';
import DepartmentForm from './DepartmentForm';
import useAppContext from '@/hooks/context/useAppContext';
import ErrorDisplay from '@/components/ErrorDisplay';

export interface CreateDepartmentProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    setDepartmentId: Dispatch<number>;
}

export default function CreateDepartment(props: CreateDepartmentProps) {
    const { company } = useAppContext();
    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The Company is not defined' }} />}
            {company && <DepartmentForm {...props} company={company} />}
        </>
    );
}
