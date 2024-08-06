export function rgb(r: number, g: number, b: number): string {
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

export function rgba(r: number, g: number, b: number, a: number): string {
    return '#' + r.toString(16) + g.toString(16) + b.toString(16) + (256 * a).toString(16);
}
