import ErrorDisplay from '@/components/ErrorDisplay';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { useGetDepartment } from '@/hooks/queries/useDepartment';
import { selectCompany } from '@/store/slices/companySlice';
import { store } from '@/store/store';
import { Dispatch } from 'react';
import DepartmentForm from './DepartmentForm';

export interface EditDepartmentProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    departmentId: number;
}

export default function EditDepartment(props: EditDepartmentProps) {
    const { open, setOpen } = props;
    const { data, isLoading, isError, error } = useGetDepartment(props.departmentId);
    const company = selectCompany(store.getState());

    return (
        <>
            {!company && <ErrorDisplay error={{ message: 'The Company is not defined' }} />}
            {isLoading && <LoadingDisplay />}
            {isError && <ErrorDisplay error={error} />}
            {company && data && (
                <DepartmentForm {...{ company, open, setOpen, department: data }} />
            )}
        </>
    );
}
