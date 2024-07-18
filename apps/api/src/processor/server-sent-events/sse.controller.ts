import { Controller, MessageEvent, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

// https://docs.nestjs.com/techniques/server-sent-events
// https:www.slingacademy.com/article/how-to-push-server-sent-events-sse-in-nestjs/

@Controller('server-events')
export class SseController {
    constructor(private readonly service: SseService) {}

    @Sse('company-stream/:companyId')
    getCompanyStream(
        @Param('companyId', ParseIntPipe) companyId: number,
    ): Observable<MessageEvent> {
        // return this.service.companyEvents.get(companyId) || new Observable();
        return this.service.getObservable(companyId);
    }
}
