import {
    CropSquare,
    DoneRounded,
    FileDownloadDoneRounded,
    LoopRounded,
    NotInterested,
} from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { amber, green, grey, red } from '@mui/material/colors';
import { ITask, TaskStatus, TaskType, dropTime } from '@repo/shared';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '../../../components/layout/Tooltip';
import useLocale from '../../../hooks/useLocale';
import { getPerson } from '../../../services/person.service';
import { updateTask } from '../../../services/task.service';
import { getPositionByPersonId } from '../../../services/position.service';
import { differenceInYears } from 'date-fns';

type Props = {
    task: ITask;
};

export function ReminderTask(props: Props) {
    const { task } = props;
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const title = useMemo(() => getTitleByTaskType(task?.type), [task]);
    const statusIcon = useMemo(() => getStatusIcon(task), [task]);
    const backgroundColor = useMemo(() => getBackgroundColor(task), [task]);
    const navigate = useNavigate();
    const { locale } = useLocale();

    const { data: person } = useQuery({
        queryKey: ['person', 'task', task],
        queryFn: async () => {
            return task.type === TaskType.HAPPY_BIRTHDAY && task.entityId
                ? await getPerson(task.entityId)
                : null;
        },
        enabled: !!task?.id,
    });

    const { data: position } = useQuery({
        queryKey: ['position', 'task', task],
        queryFn: async () => {
            return task.type === TaskType.HAPPY_BIRTHDAY && task.entityId
                ? await getPositionByPersonId({
                      personId: task.entityId,
                      relations: false,
                      onDate: task.dateFrom,
                  })
                : null;
        },
        enabled: !!person?.id,
    });

    const taskDate = useMemo(() => {
        const day = task.dateFrom.getDate();
        const month = task.dateFrom.toLocaleString(locale.dateLocale.code, { month: 'short' });
        return `${day} ${month}`;
    }, [task, locale]);

    const description = useMemo(() => {
        switch (task.type) {
            case TaskType.HAPPY_BIRTHDAY:
                return `${person?.fullName}, ${person?.birthday ? differenceInYears(task.dateTo, person?.birthday) : ''}`;
            default:
                return '';
        }
    }, [person, task]);

    const getPath = () => {
        switch (task.type) {
            case TaskType.HAPPY_BIRTHDAY:
                return position?.id ? `/people/position/${position?.id}?return=true` : '#';
            default:
                return '#';
        }
    };

    const onClickTask = () => {
        if (task.status === TaskStatus.NOT_AVAILABLE) {
            return;
        }
        const path = getPath();
        if (path) {
            navigate(path);
        }
    };

    const onClickStatus = async () => {
        if (task.status === TaskStatus.NOT_AVAILABLE) {
            return;
        }
        if (canMarkAsDone(task)) {
            if (task.status === TaskStatus.TODO || task.status === TaskStatus.IN_PROGRESS) {
                await markDone();
            } else if (task.status === TaskStatus.DONE_BY_USER) {
                await markTodo();
            }
        } else {
            onClickTask();
        }
    };

    const markDone = async () => {
        await updateTask(task.id, { status: TaskStatus.DONE_BY_USER, version: task.version });
        await queryClient.invalidateQueries({ queryKey: ['task'], refetchType: 'all' });
    };

    const markTodo = async () => {
        await updateTask(task.id, { status: TaskStatus.TODO, version: task.version });
        await queryClient.invalidateQueries({ queryKey: ['task'], refetchType: 'all' });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 1,
                py: 1,
                pl: 1,
                pr: 3,
                borderRadius: 2,
                bgcolor: backgroundColor,
            }}
        >
            <Grid
                item
                xs={11}
                component={'button'}
                onClick={() => onClickTask()}
                sx={{ border: 0, bgcolor: 'inherit', textAlign: 'left', cursor: 'pointer' }}
            >
                <Grid container>
                    <Grid
                        alignItems={'middle'}
                        alignContent={'center'}
                        width={46}
                        item
                        sx={{ mr: 1, px: 1, bgcolor: 'white', borderRadius: 2 }}
                    >
                        <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                            {taskDate.split(' ')[0]}
                        </Typography>
                        <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                            {taskDate.split(' ')[1]}
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            {t(title)}
                        </Typography>
                        <Typography sx={{ color: 'text.primary' }}>{description}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1}>
                {statusIcon && (
                    <IconButton onClick={() => onClickStatus()}>
                        <Tooltip placement="top" title={t(getStatusTooltip(task))}>
                            {statusIcon}
                        </Tooltip>
                    </IconButton>
                )}
            </Grid>
        </Box>
    );
}

function getTitleByTaskType(type: string) {
    return type;
}

function getStatusIcon(task: ITask) {
    switch (task.status) {
        case TaskStatus.NOT_AVAILABLE:
            return <NotInterested />;
        case TaskStatus.TODO:
            return <CropSquare />;
        case TaskStatus.IN_PROGRESS:
            return <LoopRounded />;
        case TaskStatus.DONE:
            return <DoneRounded />;
        case TaskStatus.DONE_BY_USER:
            return <FileDownloadDoneRounded />;
        default:
            null;
    }
}

function getBackgroundColor(task: ITask) {
    if (task.status === TaskStatus.NOT_AVAILABLE) return grey[50];
    if (task.status === TaskStatus.DONE) return green[50];
    if (task.status === TaskStatus.DONE_BY_USER) return green[50];
    if (dropTime(task.dateTo) <= dropTime(new Date())) return red[50];
    if (task.status === TaskStatus.TODO) return amber[50];
    if (task.status === TaskStatus.IN_PROGRESS) return amber[50];
    return red[50];
}

function getStatusTooltip(task: ITask) {
    if (!canMarkAsDone(task)) {
        return task.status;
    }
    if (task.status === TaskStatus.NOT_AVAILABLE) return task.status;
    if (task.status === TaskStatus.DONE) return task.status;
    if (task.status === TaskStatus.DONE_BY_USER) return 'Marked as Done';
    if (task.status === TaskStatus.TODO) return 'Mark as Done';
    if (task.status === TaskStatus.IN_PROGRESS) return 'Mark Done';
    return red[50];
}

function canMarkAsDone(task: ITask) {
    if (task.status === TaskStatus.NOT_AVAILABLE) return false;
    return true;
}
