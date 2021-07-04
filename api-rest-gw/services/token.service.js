'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET = require('./config').secret;
const EXP_TIME = require('./config').tokenTimeExp;


// Crear token
function creaToken(user){
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(EXP_TIME, 'minutes').unix()
    };

    return jwt.encode(payload, SECRET);
}

// decodificaToken
function decodificaToken(token){
    return new Promise((resolve, reject) => {
        try{
            const payload = jwt.decode(token, SECRET, true);
            if(payload.EXP_TIME <= moment().unix()){
                reject({
                    status: 401,
                    mensaje: 'Token expirado'
                });
            }
            else{
                resolve(payload.sub);
            }
        }
        catch{
            reject({
                status: 500,
                mensaje: 'Token no valido'
            });
        }
    });
}

module.exports = {
    creaToken,
    decodificaToken
};