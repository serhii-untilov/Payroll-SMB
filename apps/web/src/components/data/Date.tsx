import { maxDate, minDate } from '@repo/utils';

export type FormDateParams = {
    date: Date | undefined | null;
};

export function FormDate(params: FormDateParams) {
    const { date } = params;
    if (date instanceof FormDate) {
        if (date.getTime() <= minDate().getTime()) {
            return <>{''}</>;
        }
        if (date.getTime() >= maxDate().getTime()) {
            return <>{''}</>;
        }
    }
    return <>{date?.toString() || ''}</>;
}
