import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject, map } from 'rxjs';

@Injectable()
export class SseService {
    public companyEvents = new Map<number, Subject<MessageEvent>>();

    event(companyId: number, data: MessageEvent) {
        let eventSubject = this.companyEvents.get(companyId);
        if (!eventSubject) {
            eventSubject = new Subject<MessageEvent>();
            this.companyEvents.set(companyId, eventSubject);
        }
        eventSubject.next(data);
    }

    getObservable(companyId: number): Observable<MessageEvent> {
        let eventSubject = this.companyEvents.get(companyId);
        if (!eventSubject) {
            // throw new NotFoundException(`Event stream with ID ${companyId} not found`);
            eventSubject = new Subject<MessageEvent>();
            this.companyEvents.set(companyId, eventSubject);
            // return EMPTY;
        }
        return eventSubject.asObservable().pipe(map((data) => data));
    }
}
