// import { IUser } from './user.interface';

export interface ILogger {
    createdDate?: Date;
    createdUserId?: number;

    updatedDate?: Date;
    updatedUserId?: number;

    deletedDate?: Date;
    deletedUserId?: number;

    version?: number;
}
