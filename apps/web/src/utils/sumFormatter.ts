import { numericFormatter } from 'react-number-format';

export function sumFormatter(value: number | string, blankIfZero: boolean = true): string {
    return Number(value) || !blankIfZero
        ? numericFormatter(Number(value).toFixed(2), {
              thousandSeparator: ' ',
          })
        : '';
}
