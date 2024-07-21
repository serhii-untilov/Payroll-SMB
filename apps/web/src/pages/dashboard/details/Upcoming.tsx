import { dto } from '@/api';
import { Box, Typography } from '@mui/material';
import { TaskType } from '@repo/openapi';
import { dropTime } from '@repo/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from './Task';

type Props = {
    taskList: dto.Task[];
};

export function Upcoming(props: Props) {
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
