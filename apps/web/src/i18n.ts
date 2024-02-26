import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enJSON from './locale/en.json';
import ukJSON from './locale/uk.json';

i18n.use(LanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instance
    .init({
        detection: { order: ['navigator'] },
        fallbackLng: {
            'ru-RU': ['uk', 'en'],
            ruRU: ['uk', 'en'],
            ru: ['uk', 'en'],
            'uk-UA': ['uk', 'en'],
            ukUA: ['uk', 'en'],
            uk: ['uk', 'en'],
            default: ['en'],
        },
        debug: true,
        resources: {
            en: { ...enJSON },
            uk: { ...ukJSON },
        },
        // lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // // if you're using a language detector, do not define the lng option
    });
