import ErrorDisplay from '@/components/ErrorDisplay';
import { selectCompany } from '@/store/slices/companySlice';
import { useAppSelector } from '@/store/store.hooks';
import { Dispatch } from 'react';
import DepartmentForm from './DepartmentForm';

export interface CreateDepartmentProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    setDepartmentId: Dispatch<string>;
}

export default function CreateDepartment(props: CreateDepartmentProps) {
    const company = useAppSelector(selectCompany);
    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The Company is not defined' }} />}
            {company && <DepartmentForm {...props} company={company} />}
        </>
    );
}
