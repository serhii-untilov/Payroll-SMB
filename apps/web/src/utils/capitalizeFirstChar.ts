export function capitalizeFirstChar(word: string | undefined | null): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
}
