// import i18next from 'i18next';
// import * as i18nextBackend from 'i18next-node-fs-backend';
// import * as i18nextMiddleware from 'i18next-express-middleware';
//
// const options = {
//     // order and from where user language should be detected
//     order: [/*'path', 'session', */ 'header', 'querystring', 'cookie'],
//
//     // keys or params to lookup language from
//     lookupQuerystring: 'lng',
//     lookupCookie: 'i18next',
//     lookupSession: 'lng',
//     lookupPath: 'lng',
//     lookupHeader: 'lng',
//     lookupFromPathIndex: 0,
//
//     // cache user language
//     caches: false, // ['cookie']
// };
//
// const lngDetector = new i18nextMiddleware.LanguageDetector(null, options);
//
// i18next
//     .use(i18nextBackend)
//     .use(lngDetector)
//     .init({
//             debug: false,
//             fallbackLng: 'en',
//             backend: {loadPath: 'locales/{{lng}}.json'}
//         }
//     );
//
// export function init(route) {
//     route.use(i18nextMiddleware.handle(i18next));
// }
