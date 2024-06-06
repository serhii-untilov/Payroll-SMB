import {
    CropSquare,
    DoneAllRounded,
    DoneRounded,
    FileDownloadDoneRounded,
    LoopRounded,
    NotInterested,
} from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import { amber, green, grey, orange, red } from '@mui/material/colors';
import { ITask, TaskStatus, TaskType } from '@repo/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '../../../components/layout/Tooltip';
import { AppContextType } from '../../../context/AppContext';
import useAppContext from '../../../hooks/useAppContext';
import { updateTask } from '../../../services/task.service';

type Props = {
    task: ITask;
};

export function TodoTask(props: Props) {
    const { task } = props;
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const title = useMemo(() => getTitleByTaskType(task?.type), [task]);
    const statusIcon = useMemo(() => getStatusIcon(task), [task]);
    const backgroundColor = useMemo(() => getBackgroundColor(task), [task]);
    const navigate = useNavigate();
    const ctx = useAppContext();

    const onClickTask = () => {
        if (task.status === TaskStatus.NOT_AVAILABLE) {
            return;
        }
        const path = getPath(task.type, ctx);
        navigate(path);
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
        <Grid
            // boxShadow={1}
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
                m: 1,
                py: 1,
                px: 2,
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
                <Typography sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                    {t(title)}
                </Typography>
                <Typography sx={{ color: 'text.primary' }}>{t(task.type)}</Typography>
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
        </Grid>
    );
}

function getTitleByTaskType(type: string) {
    switch (type) {
        case TaskType.CREATE_USER:
            return 'User';
        case TaskType.CREATE_COMPANY:
            return 'Company';
        case TaskType.FILL_DEPARTMENT_LIST:
            return 'Company';
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
        default:
            return '';
    }
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
    if (task.dateTo.getTime() < new Date().getTime()) return red[50];
    if (task.status === TaskStatus.TODO) return orange[50];
    if (task.status === TaskStatus.IN_PROGRESS) return orange[50];
    return red[50];
}

function getStatusTooltip(task: ITask) {
    if (task.type === TaskType.CREATE_COMPANY) {
        return task.status;
    }
    if (task.type === TaskType.FILL_POSITION_LIST) {
        return task.status;
    }
    if (task.status === TaskStatus.NOT_AVAILABLE) return task.status;
    if (task.status === TaskStatus.DONE) return task.status;
    if (task.status === TaskStatus.DONE_BY_USER) return 'Mark as Todo';
    if (task.status === TaskStatus.TODO) return 'Mark as Done';
    if (task.status === TaskStatus.IN_PROGRESS) return 'Mark Done';
    return red[50];
}

function getPath(type: string, ctx: AppContextType): string {
    switch (type) {
        case TaskType.CREATE_COMPANY:
            return '/company/?tab=details&return=true';
        case TaskType.FILL_DEPARTMENT_LIST:
            return `/company/${ctx?.company?.id || ''}?tab=departments&return=true`;
        case TaskType.FILL_POSITION_LIST:
            return '/people?tab=positions&return=true';
        case TaskType.POST_WORK_SHEET: // = 'post-work-sheet', // Заповнення табелю
            return '/time-sheet?return=true';
        case TaskType.POST_ACCRUAL_DOCUMENT: // = 'post-accrual-document', // Розрахунок разових нарахувань
            return '/payroll?return=true';
        case TaskType.SEND_APPLICATION_FSS: // = 'post-application-fss', // Заявка у ФСС
            return '/payments?return=true';
        case TaskType.POST_PAYMENT_FSS: // = 'post-payment-fss', // Виплата по заявкам ФСС
            return '/payments?return=true';
        case TaskType.POST_ADVANCE_PAYMENT: // = 'post-advance-payment', // Виплата авансу
            return '/payments?return=true';
        case TaskType.POST_REGULAR_PAYMENT: // = 'post-regular-payment', // Виплата зарплати
            return '/payments?return=true';
        case TaskType.CLOSE_PAY_PERIOD: // = 'close-pay-period', // Закриття розрахункового періоду
            return `/company/${ctx?.company?.id || ''}?tab=periods&return=true`;
        case TaskType.SEND_INCOME_TAX_REPORT: // = 'post-income-tax-report', // Звіт з ПДФО
            return '/reports?return=true';
        default:
            return '#';
    }
}

function canMarkAsDone(task: ITask) {
    if (task.status === TaskStatus.NOT_AVAILABLE) return false;
    switch (task.type) {
        case TaskType.FILL_DEPARTMENT_LIST:
        case TaskType.POST_WORK_SHEET:
        case TaskType.POST_ACCRUAL_DOCUMENT:
            return true;
    }
    return false;
}
