import { ServerEvent } from '@repo/shared';
import { useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export function useServerCompanyEvents(companyId: number) {
    const isOnline = true; // useOnlineStatus();
    const [event, setEvent] = useState('');

    const eventSource = useMemo(() => {
        return isOnline && companyId
            ? new EventSource(`/api/server-events/company-stream/${companyId}`)
            : null;
    }, [isOnline, companyId]);

    useEffect(() => {
        if (eventSource) {
            eventSource.onerror = function (event) {
                setEvent(ServerEvent.COMMUNICATION_ERROR);
                console.log(`An error occurred while attempting to connect.`);
            };
            eventSource.onmessage = function (event) {
                setEvent(event.data);
                console.log(`New company ${companyId} message:`, event.data);
            };
            eventSource.addEventListener('customEventName', function (event) {
                setEvent(event.data);
                console.log('Custom event:', event.data);
            });
        }
    }, [eventSource, companyId]);

    return { event };
}
