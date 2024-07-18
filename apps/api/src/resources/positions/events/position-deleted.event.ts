import { Position } from '../entities/position.entity';
import { PositionEvent, PositionEventType } from './abstract/position-event';

export class PositionDeletedEvent extends PositionEvent {
    constructor(userId: number, position: Position) {
        super(PositionEventType.DELETED, userId, position);
    }
}
