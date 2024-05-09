// import { IUser } from './user.interface';

export interface ILogger {
    createdDate?: Date;
    createdUserId?: number | null;

    updatedDate?: Date;
    updatedUserId?: number | null;

    deletedDate?: Date | null;
    deletedUserId?: number | null;

    version?: number | null;
}
