import { Dispatch } from 'react';
import CreateDepartment from './CreateDepartment';
import EditDepartment from './EditDepartment';

export interface DepartmentDialogProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    departmentId: string | undefined;
    setDepartmentId: Dispatch<string>;
}

export default function DepartmentDialog(props: DepartmentDialogProps) {
    const { open, setOpen, departmentId, setDepartmentId } = props;
    return (
        <>
            {open && !!departmentId && <EditDepartment {...{ open, setOpen, departmentId }} />}
            {open && !departmentId && <CreateDepartment {...{ open, setOpen, setDepartmentId }} />}
        </>
    );
}
