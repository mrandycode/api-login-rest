const constants = require('../shared/constants');
const { config } = require('../config/config');

// Para usar estos métodos es importante que se mapeen los
// tags en los archivos translation.json

function getErrorByPathOrm(errors, req) {

    errors.map(error => {
        const message = constants.ORM_VALIDATION.find((res) =>
            res.path === error.path
            && res.validatorKey === error.validatorKey);
        return error.message = req.t(message.translateKey);
    });
    return errors;
}

function translateBoom(err, req) {
    err.output.payload.message = req.t(err.output.payload.message.toUpperCase());
    return err;
}

function getEmailRecovery(email, user, token, req) {
    const host = config.baseUrlWeb;
    const link = host + `/change/password/${token}`;
    const body = {
        from: constants.EMAILS.RECOVERY,
        to: email,
        subject: req.t('SUBJECT_RECOVERY_PASS'),
        text: 'Dar Click a el siguiente link para recuperar su contraseña ' + link,
        html: '<div style=\"display:flex; justify-content:center\"><img width=\"300px\" height=\"100px\" src=\"https://www.salvameid.com/assets/images/logo-banner.png\"></div><h1>Recuperación de contraseña</h1> <p>Hola, ' + user.name + '.</p> <p>Para cambiar tu contraseña dar click al siguiente link</p> <a href=\"' + link + '\" target=\"_blank\">Link</a> <p>Muchas gracias por preferirnos!</p> </body> </html>'
    }

    return setBodyEmail(body);
}
function setBodyEmail(body) {
    const bodyEmail = {
        from: body.from,
        to: body.to,
        subject: body.subject,
        text: body.text,
        html: body.html
    }
    return bodyEmail;
}

module.exports = { getErrorByPathOrm, translateBoom, getEmailRecovery }