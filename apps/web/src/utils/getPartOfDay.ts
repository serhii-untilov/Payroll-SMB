export function getPartOfDay(hours: number) {
    return hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';
}
