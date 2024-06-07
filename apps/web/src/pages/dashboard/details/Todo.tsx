import { ITask, TaskType } from '@repo/shared';
import { TodoTask } from './TodoTask';

type Props = {
    taskList: ITask[];
};

export function Todo(props: Props) {
    const typeList = [
        TaskType.CREATE_USER.toString(),
        TaskType.CREATE_COMPANY.toString(),
        TaskType.FILL_DEPARTMENT_LIST.toString(),
        TaskType.FILL_POSITION_LIST.toString(),
        TaskType.POST_WORK_SHEET.toString(),
        TaskType.POST_ACCRUAL_DOCUMENT.toString(),
        TaskType.SEND_APPLICATION_FSS.toString(),
        TaskType.POST_PAYMENT_FSS.toString(),
        TaskType.POST_ADVANCE_PAYMENT.toString(),
        TaskType.POST_REGULAR_PAYMENT.toString(),
        TaskType.CLOSE_PAY_PERIOD.toString(),
        TaskType.SEND_INCOME_TAX_REPORT.toString(),
    ];
    return (
        <>
            {props.taskList
                ?.filter((o) => o.dateFrom.getTime() <= new Date().getTime())
                .filter((o) => typeList.includes(o.type))
                .map((task) => <TodoTask task={task} />)}
        </>
    );
}
