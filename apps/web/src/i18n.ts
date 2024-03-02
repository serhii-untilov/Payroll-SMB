import i18n from 'i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
// import enJSON from './locale/en.json';
// import ukJSON from './locale/uk.json';

i18n.use(LanguageDetector)
    .use(HttpBackend)
    .use(initReactI18next) // bind react-i18next to the instance
    .init<HttpBackendOptions>({
        load: 'languageOnly',
        backend: {
            // path where resources get loaded from, or a function
            // returning a path:
            // function(lngs, namespaces) { return customPath; }
            // the returned path will interpolate lng, ns if provided like giving a static path
            // the function might return a promise
            // returning falsy will abort the download
            //
            // If not used with i18next-multiload-backend-adapter, lngs and namespaces will have only one element each,
            // If used with i18next-multiload-backend-adapter, lngs and namespaces can have multiple elements
            //   and also your server needs to support multiloading
            //      /locales/resources.json?lng=de+en&ns=ns1+ns2
            //   Adapter is needed to enable MultiLoading https://github.com/i18next/i18next-multiload-backend-adapter
            //   Returned JSON structure in this case is
            //   {
            //    lang : {
            //     namespaceA: {},
            //     namespaceB: {},
            //     ...etc
            //    }
            //   }
            loadPath: '/api/locales/{{lng}}/{{ns}}.json',
            // loadPath: '/api/locales/{{lng}}',

            // path to post missing resources, or a function
            // function(lng, namespace) { return customPath; }
            // the returned path will interpolate lng, ns if provided like giving a static path
            //
            // note that this only works when initialized with { saveMissing: true }
            // (see https://www.i18next.com/overview/configuration-options)
            addPath: '/api/locales/add/{{lng}}/{{ns}}',
            // addPath: '/api/locales/add/{{lng}}',

            // parse data after it has been fetched
            // in example use https://www.npmjs.com/package/json5
            // here it removes the letter a from the json (bad idea)
            // parse: function (data) {
            //     return data.replace(/a/g, '');
            // },

            // parse data before it has been sent by addPath
            parsePayload: function (namespace, key, fallbackValue) {
                return { key: fallbackValue || '' };
            },

            // parse data before it has been sent by loadPath
            // if value returned it will send a POST request
            parseLoadPayload: function (languages, namespaces) {
                return undefined;
            },

            // allow cross domain requests
            crossDomain: false,

            // allow credentials on cross domain requests
            withCredentials: false,

            // overrideMimeType sets request.overrideMimeType("application/json")
            // overrideMimeType: false,

            // custom request headers sets request.setRequestHeader(key, value)
            // customHeaders: {
            //     authorization: 'foo',
            //     // ...
            // },
            // can also be a function, that returns the headers
            // customHeaders: () => ({
            //     authorization: 'foo',
            //     // ...
            // }),

            requestOptions: {
                // used for fetch, can also be a function (payload) => ({ method: 'GET' })
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'default',
            },
        },
        detection: { order: ['navigator'] },
        saveMissing: true,
        fallbackLng: {
            'ru-RU': ['uk', 'en'],
            ruRU: ['uk', 'en'],
            ru: ['uk', 'en'],
            'uk-UA': ['uk', 'en'],
            ukUA: ['uk', 'en'],
            uk: ['uk', 'en'],
            default: ['en'],
        },
        debug: false,
        // resources: {
        //     en: { ...enJSON },
        //     uk: { ...ukJSON },
        // },
        // lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // // if you're using a language detector, do not define the lng option
    });
