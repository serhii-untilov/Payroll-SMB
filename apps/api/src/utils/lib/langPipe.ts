export function langPipe(lang: string, obj: any) {
    if (!lang) throw new Error('langPipe: Language not defined');
    if (typeof obj !== 'object') return obj;

    const result = {};

    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
            if (obj[key][lang]) {
                result[key] = obj[key][lang];
            } else if (obj[key][lang.toLowerCase()]) {
                result[key] = obj[key][lang.toLowerCase()];
            } else if (obj[key][lang.toUpperCase()]) {
                result[key] = obj[key][lang.toUpperCase()];
            } else {
                result[key] = obj[key];
            }
        } else {
            result[key] = obj[key];
        }
    });

    return result;
}
