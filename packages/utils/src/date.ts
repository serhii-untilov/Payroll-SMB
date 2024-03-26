export function monthBegin(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function monthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
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

export function formatDateTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
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
    return new Date('1900-01-01');
}

export function maxDate(): Date {
    return new Date('9999-12-31');
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
    const d = new Date(date);
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

export function date2view(date: Date): string {
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
