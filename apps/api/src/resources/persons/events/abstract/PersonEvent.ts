export enum PersonEventType {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted',
}

export abstract class PersonEvent {
    private _type: PersonEventType;
    private _userId: number;
    private _id: number;

    public get type() {
        return this._type;
    }
    public get userId() {
        return this._userId;
    }
    public get id() {
        return this._id;
    }

    constructor(type: PersonEventType, userId: number, id: number) {
        this._type = type;
        this._userId = userId;
        this._id = id;
    }
}
