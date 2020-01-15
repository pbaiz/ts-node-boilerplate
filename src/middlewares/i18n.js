'use strict';

const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');

const options = {
    // order and from where user language should be detected
    order: [/*'path', 'session', */ 'header', 'querystring', 'cookie'],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupSession: 'lng',
    lookupPath: 'lng',
    lookupHeader: 'lng',
    lookupFromPathIndex: 0,

    // cache user language
    caches: false, // ['cookie']
};


const lngDetector = new i18nextMiddleware.LanguageDetector(null, options);

i18next
    .use(i18nextBackend)
    .use(lngDetector)
    .init({
            debug: false,
            fallbackLng: 'en',
            backend: {loadPath: 'locales/{{lng}}.json'}
        }
    );

function init(route) {
    route.use(i18nextMiddleware.handle(i18next));
}

module.exports = {
    initI18n: init
};