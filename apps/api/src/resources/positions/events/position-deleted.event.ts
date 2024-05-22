import { Position } from '../entities/position.entity';

export class PositionDeletedEvent {
    userId: number;
    positionId: number;
    companyId: number;
    constructor(userId: number, position: Position) {
        this.userId = userId;
        this.positionId = position.id;
        this.companyId = position.companyId;
    }
}
