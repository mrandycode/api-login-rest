const { config } = require("../config/config");

module.exports = Object.freeze({
  ORM_VALIDATION: [
    {
      path: "profile_idx_02",
      validatorKey: "not_unique",
      translateKey: "PIN_ID_UNIQUE",
    },
    {
      path: "email",
      validatorKey: "not_unique",
      translateKey: "EMAIL_UNIQUE",
    },
  ],
  EMAIL_RECOVERY: {
    host: config.hostEmail,
    port: config.portEmail,
    path: "/api-send-mail-rest/auth/recovery/password",
    method: "POST",
    headers: {
      "api-key": config.apiKey,
      "Content-Type": "application/json",
    },
  },
  DOCTOR_ROUTER: {
    host: config.hostDomain,
    port: config.portApiCore,
    path: "/api-core-rest/doctor-profile/user-id/",
    method: "GET",
    headers: {
      "api-key": config.apiKey,
      "Content-Type": "application/json",
    },
  },
  EMAILS: {
    RECOVERY: "recovery@salvameid.com",
    SUPPORT: "support@salvameid.com",
  },
  HEALTH_ROLES: ["doctor", "veterinary"],
});
