import { Task, TaskType } from '@repo/openapi';
import { dateUTC } from '@repo/shared';
import { useMemo } from 'react';

export const todoTaskTypeList: TaskType[] = [
    TaskType.CreateUser,
    TaskType.CreateCompany,
    TaskType.FillDepartmentList,
    TaskType.FillPositionList,
    TaskType.PostWorkSheet,
    TaskType.PostAccrualDocument,
    TaskType.SendApplicationFss,
    TaskType.PostPaymentFss,
    TaskType.PostAdvancePayment,
    TaskType.PostRegularPayment,
    TaskType.ClosePayPeriod,
    TaskType.SendIncomeTaxReport,
];

export default function useTodo(taskList: Task[]): Task[] {
    const onDate = dateUTC(new Date());
    return useMemo(
        () =>
            taskList
                ?.filter((o) => o.dateFrom.getTime() <= onDate.getTime())
                .filter((o) => todoTaskTypeList.includes(o.type)),
        [taskList, onDate],
    );
}
