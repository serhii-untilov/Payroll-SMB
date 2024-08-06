import { langPipe } from './langPipe';

describe('langPipe', () => {
    const record = { id: 1, name: { en: 'Ukraine', uk: 'Україна' }, type: 'country' };

    it('name should be a string', () => {
        expect(typeof record.name).toBe('object');
        const result = langPipe('en', record);
        expect(typeof result.name).toBe('string');
        expect(result.name).toBe(record.name.en);
    });

    it('case insensitive result', () => {
        const result = langPipe('EN', record);
        expect(result.name).toBe(record.name.en);
    });
});
