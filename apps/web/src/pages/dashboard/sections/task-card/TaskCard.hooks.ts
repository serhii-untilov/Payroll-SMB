import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { tasksUpdate } from '@/services/task.service';
import { green, grey, orange, red } from '@mui/material/colors';
import { ResourceType, Task, TaskStatus, TaskType } from '@repo/openapi';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTaskStatusIcon from '@/hooks/useTaskStatusIcon';

export default function useTaskCard(props: { task: Task }) {
    const [task, setTask] = useState<Task>(props.task);
    const title = useMemo(() => getTaskTitle(task), [task]);
    const bgColor = useMemo(() => getBgColor(task), [task]);
    const path = useMemo(() => getPath(task), [task]);
    const navigate = useNavigate();
    const statusIcon = useTaskStatusIcon(task);
    const invalidateQueries = useInvalidateQueries();

    const canToggleStatus = useCallback((task: Task) => {
        if (task.status === TaskStatus.NotAvailable) return false;
        if (task.dateFrom.getTime() > new Date().getTime()) return false;
        switch (task.type) {
            case TaskType.FillDepartmentList:
            case TaskType.PostWorkSheet:
            case TaskType.PostAccrualDocument:
            case TaskType.HappyBirthday:
                return true;
        }
        return false;
    }, []);

    const markAsDone = useCallback(async () => {
        return await tasksUpdate(task.id, {
            status: TaskStatus.DoneByUser,
            version: task.version,
        });
    }, [task]);

    const markAsTodo = useCallback(async () => {
        return await tasksUpdate(task.id, {
            status: TaskStatus.Todo,
            version: task.version,
        });
    }, [task]);

    const toggleStatus = useCallback(async (): Promise<Task | null> => {
        if (!canToggleStatus(task)) return null;
        if (task.status === TaskStatus.Todo || task.status === TaskStatus.InProgress) {
            return await markAsDone();
        } else if (task.status === TaskStatus.DoneByUser) {
            return await markAsTodo();
        }
        return null;
    }, [task, canToggleStatus, markAsDone, markAsTodo]);

    const onTaskClick = useCallback(() => {
        if (task.status === TaskStatus.NotAvailable) return;
        if (path) navigate(path);
    }, [task, navigate, path]);

    const onStatusClick = useCallback(async () => {
        const updatedTask = await toggleStatus();
        if (updatedTask) {
            setTask(updatedTask);
            await invalidateQueries([ResourceType.Task]);
        } else {
            onTaskClick();
        }
    }, [onTaskClick, invalidateQueries, toggleStatus]);

    return {
        task,
        title,
        statusIcon,
        path,
        bgColor,
        onTaskClick,
        onStatusClick,
        canToggleStatus,
        toggleStatus,
        markAsDone,
        markAsTodo,
    };
}

function getTaskTitle(task: Task) {
    switch (task.type) {
        case TaskType.CreateUser:
            return 'User';
        case TaskType.CreateCompany:
            return 'Company';
        case TaskType.FillDepartmentList:
            return 'Departments';
        case TaskType.FillPositionList:
            return 'People';
        case TaskType.PostWorkSheet:
            return 'Time Sheet';
        case TaskType.PostAccrualDocument:
            return 'Payroll';
        case TaskType.SendApplicationFss:
            return 'Payments';
        case TaskType.PostPaymentFss:
            return 'Payments';
        case TaskType.PostAdvancePayment:
            return 'Payments';
        case TaskType.PostRegularPayment:
            return 'Payments';
        case TaskType.ClosePayPeriod:
            return 'Company';
        case TaskType.SendIncomeTaxReport:
            return 'Reports';
        default:
            return task.type;
    }
}

function getBgColor(task: Task) {
    if (task.dateFrom.getTime() > new Date().getTime()) {
        return grey[200];
    }
    if (task.status === TaskStatus.NotAvailable) return grey[50];
    if (task.status === TaskStatus.Done) return green[50];
    if (task.status === TaskStatus.DoneByUser) return green[50];
    if (task.dateTo.getTime() < new Date().getTime()) return red[50];
    if (task.status === TaskStatus.Todo) return orange[50];
    if (task.status === TaskStatus.InProgress) return orange[50];
    return red[50];
}

function getPath(task: Task): string {
    const { companyId } = task;
    const positionId = task.entityId;
    switch (task.type) {
        case TaskType.CreateCompany:
            return `/company/${companyId ? companyId : ''}?tab-index=0&return=true`;
        case TaskType.FillDepartmentList:
            return companyId ? `/company/${companyId || ''}?tab-index=2&return=true` : '#';
        case TaskType.FillPositionList:
            return '/people?tab-index=0&return=true';
        case TaskType.PostWorkSheet:
            return '/time-sheet?return=true';
        case TaskType.PostAccrualDocument:
            return '/payroll?return=true';
        case TaskType.SendApplicationFss:
            return '/payments?tab-index=3&return=true';
        case TaskType.PostPaymentFss:
            return '/payments?tab-index=3&return=true';
        case TaskType.PostAdvancePayment:
            return task.status === TaskStatus.Todo
                ? '/payments?tab-index=0&return=true'
                : '/payments?tab-index=1&return=true';
        case TaskType.PostRegularPayment:
            return task.status === TaskStatus.Todo
                ? '/payments?tab-index=0&return=true'
                : '/payments?tab-index=1&return=true';
        case TaskType.ClosePayPeriod:
            return companyId ? `/company/${companyId || ''}?tab-index=1&return=true` : '#';
        case TaskType.SendIncomeTaxReport:
            return '/reports?return=true';
        case TaskType.HappyBirthday:
            return positionId ? `/people/position/${positionId}?return=true` : '#';
        default:
            return '#';
    }
}
