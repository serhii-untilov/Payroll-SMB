import ErrorDisplay from '@/components/ErrorDisplay';
import { Dispatch } from 'react';
import DepartmentForm from './DepartmentForm';
import { selectCompany } from '@/store/slices/companySlice';
import { store } from '@/store/store';

export interface CreateDepartmentProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    setDepartmentId: Dispatch<number>;
}

export default function CreateDepartment(props: CreateDepartmentProps) {
    const company = selectCompany(store.getState());
    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The Company is not defined' }} />}
            {company && <DepartmentForm {...props} company={company} />}
        </>
    );
}
