import { Box, Typography } from '@mui/material';
import { ITask, TaskType, dropTime } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from './Task';

type Props = {
    taskList: ITask[];
};

export function Upcoming(props: Props) {
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
                ?.filter((o) => dropTime(o.dateFrom) > dropTime(new Date()))
                .filter((o) => typeList.includes(o.type)),
        [props, typeList],
    );
    return taskList.length ? (
        <Box>
            <Typography component="h4" variant="h4" textAlign={'center'}>
                {t('Upcoming')}
            </Typography>
            {taskList.map((task) => (
                <Task key={task.id} task={task} view="upcoming" />
            ))}
        </Box>
    ) : null;
}
