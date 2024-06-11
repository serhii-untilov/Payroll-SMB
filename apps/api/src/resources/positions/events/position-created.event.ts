import { Position } from '../entities/position.entity';
import { PositionEvent, PositionEventType } from './abstract/PositionEvent';

export class PositionCreatedEvent extends PositionEvent {
    constructor(userId: number, position: Position) {
        super(PositionEventType.CREATED, userId, position);
    }
}
