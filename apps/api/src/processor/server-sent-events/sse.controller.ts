import { Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { MessageEvent } from './lib/MessageEvent';

// https://docs.nestjs.com/techniques/server-sent-events
// https:www.slingacademy.com/article/how-to-push-server-sent-events-sse-in-nestjs/

@Controller('server-events')
export class SseController {
    constructor(private readonly service: SseService) {}

    @Sse('company-stream/:companyId')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Server sent event',
        type: MessageEvent,
    })
    getCompanyStream(
        @Param('companyId', ParseIntPipe) companyId: number,
    ): Observable<MessageEvent> {
        // return this.service.companyEvents.get(companyId) || new Observable();
        return this.service.getObservable(companyId);
    }
}
