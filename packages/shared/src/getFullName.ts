export function getFullName(lastName: string, firstName: string, middleName: string | null): string {
    return `${lastName || ''} ${firstName || ''} ${middleName || ''}`.replace('  ', ' ').trim();
}
