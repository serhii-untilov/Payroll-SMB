import { dto } from '@/api';
import { Locale } from '@/context/LocaleContext';
import { useAppContext } from '@/hooks/useAppContext';
import { useLocale } from '@/hooks/useLocale';
import { usePerson } from '@/hooks/usePerson';
import { usePositionByPerson } from '@/hooks/usePositionByPerson';
import { tasksUpdate } from '@/services/task.service';
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
import { Person, ResourceType, TaskStatus, TaskType } from '@repo/openapi';
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

export default function Task(props: Props) {
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
    const taskDate = useMemo(() => getTaskDate(task, locale), [task, locale]);
    const { person } = usePerson(task?.entityId);
    const description = useMemo(() => getDescription(task, person, t), [task, person, t]);
    const { position } = usePositionByPerson({
        companyId: company?.id,
        personId: person?.id,
        onPayPeriodDate: company?.payPeriod,
        relations: false,
    });

    const onTaskClick = () => {
        if (task.status === TaskStatus.NotAvailable) return;
        const path = getPath(task, company?.id, position);
        if (path) navigate(path);
    };

    const onStatusClick = async () => {
        if (task.status === TaskStatus.NotAvailable) return;
        if (canMarkAsDone(task, view)) {
            if (task.status === TaskStatus.Todo || task.status === TaskStatus.InProgress) {
                await markTaskDone();
            } else if (task.status === TaskStatus.DoneByUser) {
                await markTaskTodo();
            }
        } else {
            onTaskClick();
        }
    };

    const markTaskDone = async () => {
        const updatedTask = await tasksUpdate(task.id, {
            status: TaskStatus.DoneByUser,
            version: task.version,
        });
        setTask(updatedTask);
        await invalidateQueries(queryClient, [ResourceType.Task]);
    };

    const markTaskTodo = async () => {
        const updatedTask = await tasksUpdate(task.id, {
            status: TaskStatus.Todo,
            version: task.version,
        });
        setTask(updatedTask);
        await invalidateQueries(queryClient, [ResourceType.Task]);
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
                onClick={() => onTaskClick()}
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
                    <IconButton onClick={() => onStatusClick()}>{statusIcon}</IconButton>
                )}
            </Grid>
        </Box>
    );
}

function getTitleByTaskType(type: string) {
    switch (type) {
        case TaskType.CreateUser:
            return 'User';
        case TaskType.CreateCompany:
            return 'Company';
        case TaskType.FillDepartmentList:
            return 'Departments';
        case TaskType.FillPositionList:
            return 'People';
        case TaskType.PostWorkSheet:
            return 'Time Sheet';
        case TaskType.PostAccrualDocument:
            return 'Payroll';
        case TaskType.SendApplicationFss:
            return 'Payments';
        case TaskType.PostPaymentFss:
            return 'Payments';
        case TaskType.PostAdvancePayment:
            return 'Payments';
        case TaskType.PostRegularPayment:
            return 'Payments';
        case TaskType.ClosePayPeriod:
            return 'Company';
        case TaskType.SendIncomeTaxReport:
            return 'Reports';
        case TaskType.HappyBirthday:
            return type;
        default:
            return type;
    }
}

function getStatusIcon(task: dto.Task, view: TaskView) {
    if (view === 'upcoming') {
        return null;
    }
    switch (task.status) {
        case TaskStatus.NotAvailable:
            return <NotInterested />;
        case TaskStatus.Todo:
            return <CropSquare />;
        case TaskStatus.InProgress:
            return <LoopRounded />;
        case TaskStatus.Done:
            return <DoneRounded />;
        case TaskStatus.DoneByUser:
            return <FileDownloadDoneRounded />;
        default:
            null;
    }
}

function getBackgroundColor(task: dto.Task, view: TaskView) {
    if (view === 'upcoming') {
        return grey[200];
    }
    if (task.status === TaskStatus.NotAvailable) return grey[50];
    if (task.status === TaskStatus.Done) return green[50];
    if (task.status === TaskStatus.DoneByUser) return green[50];
    if (task.dateTo.getTime() < new Date().getTime()) return red[50];
    if (task.status === TaskStatus.Todo) return orange[50];
    if (task.status === TaskStatus.InProgress) return orange[50];
    return red[50];
}

function getPath(
    task: dto.Task,
    companyId: number | null | undefined,
    position: dto.Position | null | undefined,
): string {
    switch (task.type) {
        case TaskType.CreateCompany:
            return `/company/${companyId ? companyId : ''}?tab=details&return=true`;
        case TaskType.FillDepartmentList:
            return companyId ? `/company/${companyId || ''}?tab=departments&return=true` : '#';
        case TaskType.FillPositionList:
            return '/people?tab=positions&return=true';
        case TaskType.PostWorkSheet:
            return '/time-sheet?return=true';
        case TaskType.PostAccrualDocument:
            return '/payroll?return=true';
        case TaskType.SendApplicationFss:
            return '/payments?tab=sciPayments&return=true';
        case TaskType.PostPaymentFss:
            return '/payments?tab=sciPayments&return=true';
        case TaskType.PostAdvancePayment:
            return task.status === TaskStatus.Todo
                ? '/payments?tab=pay&return=true'
                : '/payments?tab=paid&return=true';
        case TaskType.PostRegularPayment:
            return task.status === TaskStatus.Todo
                ? '/payments?tab=pay&return=true'
                : '/payments?tab=paid&return=true';
        case TaskType.ClosePayPeriod:
            return companyId ? `/company/${companyId || ''}?tab=periods&return=true` : '#';
        case TaskType.SendIncomeTaxReport:
            return '/reports?return=true';
        case TaskType.HappyBirthday:
            return position?.id ? `/people/position/${position?.id}?return=true` : '#';
        default:
            return '#';
    }
}

function canMarkAsDone(task: dto.Task, view: TaskView) {
    if (view === 'upcoming') return false;
    if (task.status === TaskStatus.NotAvailable) return false;
    switch (task.type) {
        case TaskType.FillDepartmentList:
        case TaskType.PostWorkSheet:
        case TaskType.PostAccrualDocument:
        case TaskType.HappyBirthday:
            return true;
    }
    return false;
}

function getDescription(task: dto.Task, person: Person | null, t: any) {
    switch (task.type) {
        case TaskType.HappyBirthday: {
            const age = person?.birthday
                ? differenceInYears(add(task.dateTo, { days: 1 }), person?.birthday)
                : 0;
            return `${person?.fullName}, ${age || ''}`;
        }
        default:
            return t(task.type);
    }
}

function getTaskDate(task: dto.Task, locale: Locale) {
    {
        const day = task.dateFrom.getDate();
        const month = task.dateFrom.toLocaleString(locale.dateLocale.code, {
            month: 'short',
        });
        return `${day} ${month}`;
    }
}
