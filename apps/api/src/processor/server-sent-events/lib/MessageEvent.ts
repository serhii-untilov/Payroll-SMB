import { MessageEvent as NestMessageEvent } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ServerEvent } from './ServerEvent';

export class MessageEvent implements NestMessageEvent {
    @ApiProperty({ enum: ServerEvent, enumName: 'ServerEvent' })
    data: string | object | ServerEvent;
}
