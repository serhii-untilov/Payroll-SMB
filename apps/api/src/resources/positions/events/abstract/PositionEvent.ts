import { Position } from '../../entities/position.entity';

export enum PositionEventType {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted',
}

export abstract class PositionEvent {
    private _type: PositionEventType;
    private _userId: number;
    private _positionId: number;
    private _companyId: number;

    public get type() {
        return this._type;
    }
    public get userId() {
        return this._userId;
    }
    public get positionId() {
        return this._positionId;
    }
    public get companyId() {
        return this._companyId;
    }

    constructor(type: PositionEventType, userId: number, position: Position) {
        this._type = type;
        this._userId = userId;
        this._positionId = position.id;
        this._companyId = position.companyId;
    }
}
