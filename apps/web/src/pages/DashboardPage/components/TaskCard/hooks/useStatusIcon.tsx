import {
    CropSquare,
    DoneRounded,
    FileDownloadDoneRounded,
    LoopRounded,
    NotInterested,
} from '@mui/icons-material';
import { Task, TaskStatus } from '@repo/openapi';
import { useMemo } from 'react';

const useStatusIcon = (task: Task) => {
    return useMemo(() => getStatusIcon(task), [task]);
};

export default useStatusIcon;

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
