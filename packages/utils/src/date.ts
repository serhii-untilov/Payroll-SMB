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

export function dateView(date: Date): string {
    date = new Date(date);
    if (date.getTime() <= minDate().getTime()) {
        return '';
    }
    if (date.getTime() >= maxDate().getTime()) {
        return '';
    }
    return formatDate(date);
}
