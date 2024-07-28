import { Locale } from '@/context/LocaleContext';
import { tasksUpdate } from '@/services/task.service';
import { green, grey, orange, red } from '@mui/material/colors';
import { Task, TaskStatus, TaskType } from '@repo/openapi';
import { useMemo } from 'react';

export function useTask(task: Task) {
    const title = useMemo(() => getTaskTitle(task), [task]);
    const bgColor = useMemo(() => getBgColor(task), [task]);
    const path = useMemo(() => getPath(task), [task]);

    const canToggleStatus = (task: Task) => {
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
    };

    const markAsDone = async () => {
        return await tasksUpdate(task.id, {
            status: TaskStatus.DoneByUser,
            version: task.version,
        });
    };

    const markAsTodo = async () => {
        return await tasksUpdate(task.id, {
            status: TaskStatus.Todo,
            version: task.version,
        });
    };

    const toggleStatus = async (): Promise<Task | null> => {
        if (!canToggleStatus(task)) return null;
        if (task.status === TaskStatus.Todo || task.status === TaskStatus.InProgress) {
            return await markAsDone();
        } else if (task.status === TaskStatus.DoneByUser) {
            return await markAsTodo();
        }
        return null;
    };

    return { title, path, bgColor, canToggleStatus, toggleStatus, markAsDone, markAsTodo };
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

export function getTaskDate(task: Task, locale: Locale) {
    {
        const day = task.dateFrom.getDate();
        const month = task.dateFrom.toLocaleString(locale.dateLocale.code, {
            month: 'short',
        });
        return `${day} ${month}`;
    }
}
