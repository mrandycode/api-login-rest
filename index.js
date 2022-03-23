const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const passport = require('passport');
const { config } = require('./config/config');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const port = config.port || 3000;
const whitelist = [config.corsWhiteList];
const app = express();

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

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port);