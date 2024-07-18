import { parseISO } from 'date-fns';

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
const shortDateFormat = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDateString(value: any): boolean {
    return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function isShortDateString(value: any): boolean {
    return value && typeof value === 'string' && shortDateFormat.test(value);
}

// Convert strings to dates in a given object
export function deepStringToDate(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            deepStringToDate(obj[i]);
        }
        return obj;
    }

    if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (isIsoDateString(value)) {
                obj[key] = parseISO(value);
            } else if (isShortDateString(value)) {
                obj[key] = new Date(value);
            } else if (typeof value === 'object') {
                deepStringToDate(value);
            }
        }
        return obj;
    }

    if (isIsoDateString(obj)) {
        return parseISO(obj);
    }

    if (isShortDateString(obj)) {
        return new Date(obj);
    }

    return obj;
}

// Convert strings to a short dates (YYYY-MM-DD) in a given object
export function deepStringToShortDate(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            deepStringToShortDate(obj[i]);
        }
        return obj;
    }

    if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (isIsoDateString(value)) {
                obj[key] = formatDate(parseISO(value));
            } else if (typeof value === 'object') {
                deepStringToShortDate(value);
            }
        }
        return obj;
    }

    if (isIsoDateString(obj)) {
        return formatDate(parseISO(obj));
    }

    return obj;
}

export function dateUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function monthBegin(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
}

export function monthEnd(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));
}

export function formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

export function formatDateTime(date: Date, locale: string = 'en-us'): string {
    const d = new Date(date);
    return d.toLocaleDateString(locale, {
        // weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatPeriod(dateFrom: Date, dateTo: Date): string {
    const d1 = new Date(dateFrom);
    let month = '' + (d1.getMonth() + 1);
    const day1 = '' + d1.getDate();
    const year = d1.getFullYear();

    const d2 = new Date(dateTo);
    const day2 = '' + d2.getDate();

    if (month.length < 2) month = '0' + month;

    return `${day1} - ${day2}/${month}/${year}`;
}

export function dateToTime(date: Date): number {
    const d = new Date(date);
    return d.getTime();
}

export function minDate(): Date {
    return monthBegin(new Date('1900-01-01'));
}

export function maxDate(): Date {
    return monthEnd(new Date('9999-12-31'));
}

export function getMonthName(date: Date): string {
    const d = new Date(date);
    const names = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    return names[d.getMonth()];
}

export function getPeriodName(date: Date, format: string = 'ym'): string {
    const d = date; // new Date(date);
    const monthName = getMonthName(d);
    const year = d.getFullYear();
    return format.localeCompare('ym') === 0 ? `${year} ${monthName}` : `${monthName} ${year}`;
}

export function normalizeDate(date: Date): Date {
    const d = new Date(date);
    if (d.getTime() < minDate().getTime()) return minDate();
    if (d.getTime() > maxDate().getTime()) return maxDate();
    if (d.getFullYear() < 1901) return minDate();
    if (d.getFullYear() >= 9999) return maxDate();
    return d;
}

export function date2view(date: Date): string | null {
    const d = normalizeDate(new Date(date));
    if (d.getTime() <= minDate().getTime()) {
        return '';
    }
    if (d.getTime() >= maxDate().getTime()) {
        return '';
    }
    return formatDate(d);
}

export function view2date(date: string, defaultValue: string | null = null): string {
    if (date && date.length) return formatDate(normalizeDate(new Date(date)));

    if (defaultValue && defaultValue.length)
        return formatDate(normalizeDate(new Date(defaultValue)));

    return formatDate(minDate());
}

export function getMinDate(date1: Date, date2: Date): Date {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getTime() < d2.getTime() ? d1 : d2;
}

export function getMaxDate(date1: Date, date2: Date): Date {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getTime() > d2.getTime() ? d1 : d2;
}

export function dropTime(date: Date): number {
    return date.setHours(0, 0, 0, 0);
}

export function toDate(date: string | undefined, defaultValue: Date | null = null): Date {
    if (date) {
        if (isIsoDateString(date)) {
            return parseISO(date);
        }
        return dateUTC(new Date(date));
    }
    if (defaultValue) {
        return dateUTC(defaultValue);
    }
    return dateUTC(new Date());
}
