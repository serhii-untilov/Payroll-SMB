import { Position } from './../entities/position.entity';
import { PositionEvent, PositionEventType } from './abstract/position-event';

export class PositionUpdatedEvent extends PositionEvent {
    constructor(userId: string, position: Position) {
        super(PositionEventType.UPDATED, userId, position);
    }
}
