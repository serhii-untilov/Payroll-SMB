export function getFullName(lastName: string, firstName: string, middleName: string): string {
    return `${lastName || ''} ${firstName || ''} ${middleName || ''}`.replace('  ', ' ').trim();
}
