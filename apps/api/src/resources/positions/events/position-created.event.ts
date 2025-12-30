import { Position } from './../entities/position.entity';
import { PositionEvent, PositionEventType } from './abstract/position-event';

export class PositionCreatedEvent extends PositionEvent {
    constructor(userId: string, position: Position) {
        super(PositionEventType.CREATED, userId, position);
    }
}
