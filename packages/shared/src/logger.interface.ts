// import { IUser } from './user.interface';

export interface ILogger {
    createdDate?: Date;
    createdUserId?: number;

    updatedDate?: Date;
    updatedUserId?: number;

    deletedDate?: Date | null;
    deletedUserId?: number | null;

    version?: number;
}
