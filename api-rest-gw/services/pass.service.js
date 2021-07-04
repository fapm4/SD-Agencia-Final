'use strict'

const bcrypt = require('bcrypt')

// $2b$10$OcT/8py/gNGPGVIBW1BTs.M14dEgRLDTRsRoFm3WHuukCuZv1vCxy
// ****-- ********************* +++++++++++++++++++++++++++++++
// Alg C           Salt                  Hash

// Devuelve un hash con un salt con el anterior formato
function encriptaPassword(pass){
    return bcrypt.hash(pass, 10);
}

// Devuelve true o false si coinciden el pass y el hash
function comparaPassword(pass, hash){
    return bcrypt.compare(pass, hash);
}

module.exports = {
    encriptaPassword,
    comparaPassword
};