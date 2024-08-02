import { Person, Task } from '@repo/openapi';
import { add, differenceInYears } from 'date-fns';
import { useMemo } from 'react';

export default function useHappyBirthdayDescription(task: Task, person: Person) {
    return useMemo(() => {
        const age = person?.birthday
            ? differenceInYears(add(task.dateTo, { days: 1 }), person?.birthday)
            : 0;
        return `${person?.fullName}, ${age || ''}`;
    }, [task, person]);
}
