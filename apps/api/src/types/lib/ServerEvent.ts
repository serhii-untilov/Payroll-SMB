// export type ServerEventType = 'started' | 'finished' | 'failed' | '';

// export function getServerEventType(event: ServerEvent | string): ServerEventType {
//     if (event.includes('error') || event.includes('failed')) return 'failed';
//     return event.split('-')[1] as ServerEventType;
// }

// export type ServerEventGroup = 'payroll' | 'tasklist';

// export function getServerEventGroup(event: ServerEvent | string): ServerEventGroup {
//     return event.split('-')[0] as ServerEventGroup;
// }

export enum ServerEvent {
    COMMUNICATION_ERROR = 'communication-error',

    PAYROLL_STARTED = 'payroll-started',
    PAYROLL_FINISHED = 'payroll-finished',
    PAYROLL_FAILED = 'payroll-failed',

    TASKLIST_STARTED = 'tasklist-started',
    TASKLIST_FINISHED = 'tasklist-finished',
    TASKLIST_FAILED = 'tasklist-failed',
}
