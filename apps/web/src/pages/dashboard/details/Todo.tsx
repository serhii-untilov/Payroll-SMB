import { ITask, TaskType } from '@repo/shared';
import { Task } from './Task';
import { useMemo } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    taskList: ITask[];
};

export function Todo(props: Props) {
    const { t } = useTranslation();
    const typeList = useMemo(
        () => [
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
        ],
        [],
    );
    const taskList = useMemo(
        () =>
            props.taskList
                ?.filter((o) => o.dateFrom.getTime() <= new Date().getTime())
                .filter((o) => typeList.includes(o.type)),
        [props, typeList],
    );
    return taskList.length ? (
        <Box>
            <Typography component="h3" variant="h3" textAlign={'center'}>
                {t('Things to do')}
            </Typography>
            {taskList.map((task) => (
                <Task task={task} view="todo" />
            ))}
        </Box>
    ) : null;
}
