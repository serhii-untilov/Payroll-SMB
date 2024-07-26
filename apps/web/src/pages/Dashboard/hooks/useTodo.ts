import { Task, TaskType } from '@repo/openapi';

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

const useTodo = (taskList: Task[]) => {
    const onDate = new Date();
    return taskList
        ?.filter((o) => o.dateFrom.getTime() <= onDate.getTime())
        .filter((o) => todoTaskTypeList.includes(o.type));
};

export default useTodo;
