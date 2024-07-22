import { formatDate, maxDate, minDate, view2date } from './date';

describe('dateUtils', () => {
    it('should be the same date as min date', () => {
        const d1 = minDate();
        const d2 = new Date('1900-01-01');
        expect(d2.getTime() === d1.getTime()).toBeTruthy();
    });

    it('should be the same date as min date after converting', () => {
        const d1 = minDate();
        const d2 = new Date(view2date('', formatDate(minDate())));
        expect(d2.getTime() === d1.getTime()).toBeTruthy();
    });

    it('should be the same date as max date', () => {
        const d1 = maxDate();
        const d2 = new Date('9999-12-31');
        expect(d2.getTime() === d1.getTime()).toBeTruthy();
    });

    it('should be the same date as max date after converting', () => {
        const d1 = maxDate();
        const d2 = new Date(view2date('', formatDate(maxDate())));
        expect(d2.getTime() === d1.getTime()).toBeTruthy();
    });
});
