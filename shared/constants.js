module.exports = Object.freeze({
     ORM_VALIDATION: [
        {
            path: 'profile_idx_02',
            validatorKey: 'not_unique',
            translateKey: 'PIN_ID_UNIQUE'
        },
        {
            path: 'email',
            validatorKey: 'not_unique',
            translateKey: 'EMAIL_UNIQUE'
        }
        
    ]
},
);