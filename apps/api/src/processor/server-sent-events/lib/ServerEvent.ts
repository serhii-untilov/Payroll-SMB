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
    CommunicationError = 'communication-error',

    PayrollStarted = 'payroll-started',
    PayrollFinished = 'payroll-finished',
    PayrollFailed = 'payroll-failed',

    TasklistStarted = 'tasklist-started',
    TasklistFinished = 'tasklist-finished',
    TasklistFailed = 'tasklist-failed',
}
