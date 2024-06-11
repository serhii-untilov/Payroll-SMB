import { Position } from '../entities/position.entity';
import { PositionEvent, PositionEventType } from './abstract/PositionEvent';

export class PositionUpdatedEvent extends PositionEvent {
    constructor(userId: number, position: Position) {
        super(PositionEventType.UPDATED, userId, position);
    }
}
