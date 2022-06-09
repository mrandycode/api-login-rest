const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const passport = require('passport');
const { config } = require('./config/config');
const {
    logErrors,
    errorHandler,
    boomErrorHandler,
    ormErrorHandler,
    jsonWebtoken
} = require('./middlewares/error.handler');
const port = config.port || 3000;
const whitelist = config.corsWhiteList;
const i18next = require('i18next');
const BackendI18n = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next.use(BackendI18n).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'es',
        backend: {
            loadPath: '.././locales/{{lng}}/translation.json'
        }
    })

const app = express();
app.use(middleware.handle(i18next));
app.use(express.json());

const options = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Host no permitido'));
        }
    }
}

app.use(cors(options));
app.use(passport.initialize());
require('./utils/auth');

app.get('/', (req, res) => {
    res.send('Welcome to api-login-rest-1.0');
});


routerApi(app);

app.use(jsonWebtoken);
app.use(boomErrorHandler);
app.use(logErrors);
app.use(ormErrorHandler);
app.use(errorHandler);

app.listen(port);