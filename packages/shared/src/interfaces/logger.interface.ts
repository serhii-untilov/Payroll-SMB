// import { IUser } from './user.interface';

export interface ILogger {
    createdDate?: Date;
    // createdUser?: IUser;
    createdUserId?: number;

    updatedDate?: Date;
    // updatedUser?: IUser;
    updatedUserId?: number;

    deletedDate?: Date;
    // deletedUser?: IUser;
    deletedUserId?: number;

    version?: number;
}
