import { dto } from '@/api';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TaskType } from '@repo/openapi';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from './Task';

type Props = {
    taskList: dto.Task[];
};

export function Todo(props: Props) {
    const { t } = useTranslation();
    const typeList = useMemo(
        () => [
            TaskType.CreateUser.toString(),
            TaskType.CreateCompany.toString(),
            TaskType.FillDepartmentList.toString(),
            TaskType.FillPositionList.toString(),
            TaskType.PostWorkSheet.toString(),
            TaskType.PostAccrualDocument.toString(),
            TaskType.SendApplicationFss.toString(),
            TaskType.PostPaymentFss.toString(),
            TaskType.PostAdvancePayment.toString(),
            TaskType.PostRegularPayment.toString(),
            TaskType.ClosePayPeriod.toString(),
            TaskType.SendIncomeTaxReport.toString(),
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
            <Typography component="h4" variant="h4" textAlign={'center'}>
                {t('Things to do')}
            </Typography>
            {taskList.map((task) => (
                <Task key={task.id} task={task} view="todo" />
            ))}
        </Box>
    ) : null;
}
