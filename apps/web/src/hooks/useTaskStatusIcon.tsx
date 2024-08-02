import {
    CropSquare,
    DoneRounded,
    FileDownloadDoneRounded,
    LoopRounded,
    NotInterested,
} from '@mui/icons-material';
import { Task, TaskStatus } from '@repo/openapi';
import { useMemo } from 'react';

export default function useTaskStatusIcon(task: Task) {
    return useMemo(() => getStatusIcon(task), [task]);
}

function getStatusIcon(task: Task) {
    if (task.dateFrom.getTime() > new Date().getTime()) {
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
