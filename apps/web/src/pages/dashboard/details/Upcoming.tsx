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
    const { taskList } = props;
    const { t } = useTranslation();
    const typeList = useMemo(() => getTypeList(), []);
    const filteredTaskList = useMemo(() => filter(taskList, typeList), [taskList, typeList]);

    return filteredTaskList.length ? (
        <Box>
            <Typography component="h4" variant="h4" textAlign={'center'}>
                {t('Upcoming')}
            </Typography>
            {filteredTaskList.map((task) => (
                <Task key={task.id} task={task} view="upcoming" />
            ))}
        </Box>
    ) : null;
}

function getTypeList() {
    return [
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
}

function filter(taskList: dto.Task[], typeList: TaskType[]) {
    return taskList
        .filter((o) => dropTime(o.dateFrom) > dropTime(new Date()))
        .filter((o) => typeList.includes(o.type));
}
