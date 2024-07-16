import { api, dto } from '@/api';
import useAppContext from '@/hooks/useAppContext';
import useLocale from '@/hooks/useLocale';
import { usePerson } from '@/hooks/usePerson';
import { usePositionByPerson } from '@/hooks/usePositionByPerson';
import { invalidateQueries } from '@/utils/invalidateQueries';
import {
    CropSquare,
    DoneRounded,
    FileDownloadDoneRounded,
    LoopRounded,
    NotInterested,
} from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { green, grey, orange, red } from '@mui/material/colors';
import { Task as ITask } from '@repo/openapi';
import { ResourceType, TaskStatus, TaskType } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { add, differenceInYears } from 'date-fns';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type TaskView = 'todo' | 'reminder' | 'upcoming';

type Props = {
    task: dto.Task;
    view: TaskView;
};

export function Task(props: Props) {
    const [task, setTask] = useState(props.task);
    const { view } = props;
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { company } = useAppContext();
    const { locale } = useLocale();
    const title = useMemo(() => getTitleByTaskType(task?.type), [task]);
    const statusIcon = useMemo(() => getStatusIcon(task, view), [task, view]);
    const backgroundColor = useMemo(() => getBackgroundColor(task, view), [task, view]);
    const { data: person } = usePerson({ id: task?.entityId });
    const { position } = usePositionByPerson({
        companyId: company?.id,
        personId: person?.id,
        onPayPeriodDate: company?.payPeriod,
        relations: false,
    });

    const taskDate = useMemo(() => {
        const day = task.dateFrom.getDate();
        const month = task.dateFrom.toLocaleString(locale.dateLocale.code, {
            month: 'short',
        });
        return `${day} ${month}`;
    }, [task, locale]);

    const description = useMemo(() => {
        switch (task.type) {
            case TaskType.HAPPY_BIRTHDAY:
                return `${person?.fullName}, ${person?.birthday ? differenceInYears(add(task.dateTo, { days: 1 }), person?.birthday) : ''}`;
            default:
                return t(task.type);
        }
    }, [person, task, t]);

    const onClickTask = () => {
        if (task.status === TaskStatus.NOT_AVAILABLE) {
            return;
        }
        const path = getPath(task, company?.id, position);
        if (path) {
            navigate(path);
        }
    };

    const onClickStatus = async () => {
        if (task.status === TaskStatus.NOT_AVAILABLE) {
            return;
        }
        if (canMarkAsDone(task, view)) {
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
        const updatedTask = (
            await api.tasksUpdate(task.id, {
                status: TaskStatus.DONE_BY_USER,
                version: task.version,
            })
        ).data;
        setTask(updatedTask);
        await queryClient.invalidateQueries({ queryKey: ['task'], refetchType: 'all' });
    };

    const markTodo = async () => {
        const updatedTask = (
            await api.tasksUpdate(task.id, { status: TaskStatus.TODO, version: task.version })
        ).data;
        setTask(updatedTask);
        await invalidateQueries(queryClient, [ResourceType.TASK]);
    };

    return (
        <Box
            id={`task-id-${task.id}`}
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: 1,
                py: 1,
                pl: 1,
                pr: 3,
                borderRadius: 2,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : backgroundColor),
                border: (theme) => (theme.palette.mode === 'dark' ? '1px solid grey' : ''),
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
                    {view !== 'todo' ? (
                        <Grid
                            alignItems={'middle'}
                            alignContent={'center'}
                            width={48}
                            item
                            sx={{
                                mr: 1,
                                px: 1,
                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '' : 'white'),
                                borderRadius: 2,
                            }}
                        >
                            <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                                {taskDate.split(' ')[0]}
                            </Typography>
                            <Typography sx={{ color: 'text.primary', textAlign: 'center' }}>
                                {taskDate.split(' ')[1].replace('.', '')}
                            </Typography>
                        </Grid>
                    ) : null}
                    <Grid item xs={9} sx={{ ml: 1 }}>
                        <Typography sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                            {t(title)}
                        </Typography>
                        <Typography sx={{ color: 'text.primary' }}>{description}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1}>
                {statusIcon && (
                    <IconButton onClick={() => onClickStatus()}>{statusIcon}</IconButton>
                )}
            </Grid>
        </Box>
    );
}

function getTitleByTaskType(type: string) {
    switch (type) {
        case TaskType.CREATE_USER:
            return 'User';
        case TaskType.CREATE_COMPANY:
            return 'Company';
        case TaskType.FILL_DEPARTMENT_LIST:
            return 'Departments';
        case TaskType.FILL_POSITION_LIST:
            return 'People';
        case TaskType.POST_WORK_SHEET:
            return 'Time Sheet';
        case TaskType.POST_ACCRUAL_DOCUMENT:
            return 'Payroll';
        case TaskType.SEND_APPLICATION_FSS:
            return 'Payments';
        case TaskType.POST_PAYMENT_FSS:
            return 'Payments';
        case TaskType.POST_ADVANCE_PAYMENT:
            return 'Payments';
        case TaskType.POST_REGULAR_PAYMENT:
            return 'Payments';
        case TaskType.CLOSE_PAY_PERIOD:
            return 'Company';
        case TaskType.SEND_INCOME_TAX_REPORT:
            return 'Reports';
        case TaskType.HAPPY_BIRTHDAY:
            return type;
        default:
            return type;
    }
}

function getStatusIcon(task: ITask, view: TaskView) {
    if (view === 'upcoming') {
        return null;
    }
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

function getBackgroundColor(task: ITask, view: TaskView) {
    if (view === 'upcoming') {
        return grey[200];
    }
    if (task.status === TaskStatus.NOT_AVAILABLE) return grey[50];
    if (task.status === TaskStatus.DONE) return green[50];
    if (task.status === TaskStatus.DONE_BY_USER) return green[50];
    if (task.dateTo.getTime() < new Date().getTime()) return red[50];
    if (task.status === TaskStatus.TODO) return orange[50];
    if (task.status === TaskStatus.IN_PROGRESS) return orange[50];
    return red[50];
}

function getPath(
    task: dto.Task,
    companyId: number | null | undefined,
    position: dto.Position | null | undefined,
): string {
    switch (task.type) {
        case TaskType.CREATE_COMPANY:
            return `/company/${companyId ? companyId : ''}?tab=details&return=true`;
        case TaskType.FILL_DEPARTMENT_LIST:
            return companyId ? `/company/${companyId || ''}?tab=departments&return=true` : '#';
        case TaskType.FILL_POSITION_LIST:
            return '/people?tab=positions&return=true';
        case TaskType.POST_WORK_SHEET:
            return '/time-sheet?return=true';
        case TaskType.POST_ACCRUAL_DOCUMENT:
            return '/payroll?return=true';
        case TaskType.SEND_APPLICATION_FSS:
            return '/payments?tab=sciPayments&return=true';
        case TaskType.POST_PAYMENT_FSS:
            return '/payments?tab=sciPayments&return=true';
        case TaskType.POST_ADVANCE_PAYMENT:
            return task.status === TaskStatus.TODO
                ? '/payments?tab=pay&return=true'
                : '/payments?tab=payed&return=true';
        case TaskType.POST_REGULAR_PAYMENT:
            return task.status === TaskStatus.TODO
                ? '/payments?tab=pay&return=true'
                : '/payments?tab=payed&return=true';
        case TaskType.CLOSE_PAY_PERIOD:
            return companyId ? `/company/${companyId || ''}?tab=periods&return=true` : '#';
        case TaskType.SEND_INCOME_TAX_REPORT:
            return '/reports?return=true';
        case TaskType.HAPPY_BIRTHDAY:
            return position?.id ? `/people/position/${position?.id}?return=true` : '#';
        default:
            return '#';
    }
}

function canMarkAsDone(task: ITask, view: TaskView) {
    if (view === 'upcoming') return false;
    if (task.status === TaskStatus.NOT_AVAILABLE) return false;
    switch (task.type) {
        case TaskType.FILL_DEPARTMENT_LIST:
        case TaskType.POST_WORK_SHEET:
        case TaskType.POST_ACCRUAL_DOCUMENT:
        case TaskType.HAPPY_BIRTHDAY:
            return true;
    }
    return false;
}
