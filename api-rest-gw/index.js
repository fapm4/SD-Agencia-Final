'use strict'

const port = process.env.PORT || 3101;
const miIp = "192.168.0.9";

// Variables de entorno para que sea más fácil de modificar
const ipVuelos = "192.168.0.9"; const puertoVuelos = "3000";
const ipHotel = "192.168.0.9"; const puertoHoteles = "3002";
const ipCoches = "192.168.0.9"; const puertoCoches = "3001"

const URL_WS_VUELOS = `https://${ipVuelos}:${puertoVuelos}/api`;
const URL_WS_HOTEL = `https://${ipHotel}:${puertoHoteles}/api`;
const URL_WS_COCHES = `https://${ipCoches}:${puertoCoches}/api`;

//////////////////////////////////////////////////////////////////
// Definición de MIDDLEWARES

// Express
const express = require('express')
const app = express()

// Https
const https = require('https')
const fs = require('fs')

// Leer certificado
const OPTIONS_HTTPS = {
	key: fs.readFileSync('./cert/key.pem'),
	cert: fs.readFileSync('./cert/cert.pem')
}

// Logger
const logger = require('morgan');
app.use(logger('dev'));

// URLencoded
app.use(express.urlencoded({extended: false}));

// JSON
app.use(express.json());

// Helmet
var helmet = require('helmet');
app.use(helmet());
// pass mongo Kenia12345

// Conexión a la BD
const mongojs = require('mongojs');
var db = mongojs('mongodb+srv://Francisco:Kenia12345@agencia.boyzs.mongodb.net/Agencia?retryWrites=true&w=majority');
var id = mongojs.ObjectID;


// Cors
const cors = require('cors');

var allowCrossTokenHeader = (req, res, next) => {
	res.header("Access-Control-Allow-Headers", "*");
	return next();
};

var allowCrossTokenOrigin = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	return next();
};

app.use(cors());
app.use(allowCrossTokenHeader);
app.use(allowCrossTokenOrigin);


// Node-fetch
const fetch = require('node-fetch');

// Bcrypt
const bcrypt = require('bcrypt');

// Moment
const moment = require('moment');

// JWT
const jwt = require('jwt-simple');

// mi TokenService
const TokenService = require('./services/token.service');

// mi PassService
const PassService = require('./services/pass.service');
const { response } = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";                  
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// Funciones auxiliares

// Actualiza la coleccion
app.param("colecciones", (req, res, next, colecciones) => {
	console.log('middleware param /api:colecciones');
	req.collection = db.collection(colecciones);
	return next();
});

// Middleware de autorizacion
// Este middleware es similar al que se encuentra debajo. La principal diferencia es que al usuar el Front-end, para autenticar
// y autorizar a un usuario con el loggin o el registro, se usa el nombre del usuario y el ID que genera MongoDB
function authFRONT(req, res, next){
    if(!req.params.id){
        res.status(401).json({
            result: 'KO',
            mensaje: "No se especifica el id del usuario"
        });

        return next(new Error("Falta el id del usuario"));
    }

    var collection = db.collection("agencias");
    const queId = req.params.id;

    try{
        collection.findOne({"user": queId}, (err, elemento) => {
            if(err) res.json(`ID: ${queId} no valida`);
            console.log(elemento);
            TokenService.decodificaToken(elemento.token)
            .then(userId => {
                console.log("Usuario autorizado");
            })
            .catch(err => {
                res.status(401).json({
                    result: 'KO',
                    mensaje: "Error en la identificación: Token caducado"
                });
            });

        });
    }

    catch(err){
        if(err) res.json(`ID: ${queId} no valida`);
    }

	if(!req.headers.authorization){
		// Responder sin permiso
		res.status(401).json({
			result: 'KO',
			mensaje: "No se ha enviado el token de tipo Bearer en la cabecera Authorization"
		});

		return next(new Error("Falta el token de autorizacion"));
	}

    const miToken = req.headers.authorization.split(" ")[1];
	console.log(miToken);
	if(miToken === "MITOKEN123456789"){
        req.params.token = miToken;
		return next();
	}
	
	res.status(401).json({
		result: 'KO',
		mensaje: "Acceso no autorizado a este servicio"
	});
	return next(new Error("Token de autorizacion erroneo"));
}

// Middleware de autorizacion
function auth(req, res, next){

    if(!req.params.id){
        res.status(401).json({
            result: 'KO',
            mensaje: "No se especifica el id del usuario"
        });

        return next(new Error("Falta el id del usuario"));
    }

    var collection = db.collection("agencias");
    const queId = req.params.id;

    try{
        collection.findOne({_id: id(queId)}, (err, elemento) => {
            if(err) res.json(`ID: ${queId} no valida`);
            console.log(elemento);
            TokenService.decodificaToken(elemento.token)
            .then(userId => {
                console.log("Usuario autorizado");
            })
            .catch(err => {
                res.status(401).json({
                    result: 'KO',
                    mensaje: "Error en la identificación: Token caducado"
                });
            });

        });
    }

    catch(err){
        if(err) res.json(`ID: ${queId} no valida`);
    }

	if(!req.headers.authorization){
		res.status(401).json({
			result: 'KO',
			mensaje: "No se ha enviado el token de tipo Bearer en la cabecera Authorization"
		});

		return next(new Error("Falta el token de autorizacion"));
	}

    const miToken = req.headers.authorization.split(" ")[1];
	console.log(miToken);
	if(miToken === "MITOKEN123456789"){
        req.params.token = miToken;
		return next();
	}
	
	res.status(401).json({
		result: 'KO',
		mensaje: "Acceso no autorizado a este servicio"
	});
	return next(new Error("Token de autorizacion erroneo"));
}


//////////////////////////////////////////////////////////////////
// Función para obtener el proveedor a través de la URL
function isProveedor(req, res, next, opcion){
    const queProveedor = req.params.proveedores;
    const queColeccion = req.params.colecciones;
    var queUrl = ``;
  

    switch(queProveedor){
        case "vuelo":
            queUrl = `${URL_WS_VUELOS}`;
            break;

        case "coche":
            queUrl = `${URL_WS_COCHES}`;
            break;

        case "hotel":
            queUrl = `${URL_WS_HOTEL}`;
            break;

        case "identificar":
            break;

        default:
            res.json(`End-point ${queProveedor} no valido`);
    }
    
    if(req.params.colecciones){
        queUrl += `/${queColeccion}`;
    }
    
    if(req.params.id && opcion == true){
        queUrl += `/${req.params.id}`
    }

    if(req.params.reserva){
        queUrl += `/${req.params.reserva}`;
    }

    if(req.params.idProveedor){
        queUrl += `/${req.params.idProveedor}`;
    }

    return queUrl;
}

//////////////////////////////////////////////////////////////////
// Función encargada de crear el hash para la contraseña del usuario y crear un token con su contraseña
function createHashSalt(req ,res, next){
    const pass = req.body.password;

    PassService.encriptaPassword(pass, 10)
    .then(hash => {
        console.log(`Hash = ${hash}`);
        req.body.password = hash;
        var collection = db.collection("agencias");
        const queToken = TokenService.creaToken(pass);
        collection.save({user: req.body.user, password: hash, token: queToken}, (err, elementoGuardado) => {
            if (err) return next(err);
    
            console.log(elementoGuardado);
            res.status(201).json({
                result: 'OK',
                elemento: elementoGuardado
            });
        });
    })
    .catch(err => console.log(err));
}

//////////////////////////////////////////////////////////////////
// Función para comparar la contreña del usuario con el hash que le pasamos
function verifyPassword(hash, req, res, next){
    const pass = req.body.password;
    const queId = req.params.id;
    const user = req.body.user;

    PassService.comparaPassword(pass, hash)
    .then(resultado => {
        if(resultado){
            console.log("Contraseña correcta");
            const token = TokenService.creaToken(queId);

            console.log(token);
            console.log("Usuario y contraseña correctos");

            TokenService.decodificaToken(token)
            .then(userId => {
                console.log("Usuario autenticado y autorizado correctamente");
            })
            .catch(err => res.json("Token caducado"));

            var collection = db.collection("agencias");
            collection.update({_id: id(queId)}, {$set: {token: token}}, function(err, elementoGuardado) {
                if (err || !elementoGuardado){
                    res.json(`${user} no encontrado`);
                } 
                else{
                    res.json(`Bienvenido otra vez ${user}`);
                } 
            });
        }
        else{
            res.json("Contraseña invalida");
        }
    })
    .catch(error => console.log(error));
}

//////////////////////////////////////////////////////////////////
// Función para comprobar la contraseña del usuario con el hash que le pasamos.
// Igual que pasaba con la función auth, hay dos métodos muy parecidos y que se diferencian
// en lo mismo. Al usar nuestro front-end, para inciar sesión tenemos que usar un POST
// para poder mandar inforamción adicional del usuario. Esto esta mejor explicado en la memoria. 
function verifyPasswordPOST(hash, req, res, next){
    const pass = req.body.password;
    const queId = req.params.id;
    const user = req.body.user;

    PassService.comparaPassword(pass, hash)
    .then(resultado => {
        if(resultado){
            console.log("Contraseña correcta");
            const token = TokenService.creaToken(queId);

            console.log(token);
            console.log("Usuario y contraseña correctos");

            TokenService.decodificaToken(token)
            .then(userId => {
                console.log("Usuario autenticado y autorizado correctamente");
            })
            .catch(err => res.json("Token caducado"));

            var collection = db.collection("agencias");
            collection.update({"user": queId}, {$set: {token: token}}, function(err, elementoGuardado) {
                if (err || !elementoGuardado){
                    res.json(`${user} no encontrado`);
                } 
                else{
                    res.json(`Bienvenido otra vez ${user}`);
                } 
            });
        }
        else{
            res.json("Contraseña invalida");
        }
    })
    .catch(error => console.log(error));
}
//////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////
// Mis llamadas al API

//////////////////////////////////////////////////////////////////
// Identificamos un usuario en nuestra base de datos con la particularidad que cuando
// usamos esta llamada estamos usando postman o el navegador web
app.get('/api/identificar/:id', (req, res, next) => {
    const queID = req.params.id;
    var hash = "";
    console.log(queID);

    var collection = db.collection("agencias");
    collection.findOne({"user": queID},(err, elemento) => {
        if(err) res.json(`Id: ${queID}, no válida`);
  
        console.log(elemento);
        hash = elemento.password;
        verifyPassword(hash, req, res, next);
    });
 });

//////////////////////////////////////////////////////////////////
// Identificamos un usuario en nuestra base de datos con la particularidad que cuando
// usamos esta llamada estamos usando el front-end
 app.post('/api/identificar/:id', (req, res, next) => {
    const queID = req.params.id;
    var hash = ``;
    console.log(queID);

    var collection = db.collection("agencias");
    collection.findOne({"user": queID},(err, elemento) => {
        if(err) res.json(`Id: ${queID}, no válida`);
  
        console.log(elemento);
        hash = elemento.password;
        verifyPasswordPOST(hash, req, res, next);
    });
 });

//////////////////////////////////////////////////////////////////
// Buscamos las reservas del usuario con id = req.params.id
app.get('/api/reserva/:id', (req, res, next) => {
    const queID = req.params.id;
  
    var collection = db.collection("reservas");
  
    collection.find({"idUsuario": id(queID)},(err, elemento) => {
        if(err) res.json(`Id: ${queID}, no tiene reservas`);
        res.json(elemento);
    });
 });

//////////////////////////////////////////////////////////////////
// Obtenemos los proveedores de nuestro agencia de viajes
app.get('/api', (req, res, next) =>{
    res.json({
        result: "OK",
        proveedores: [
            {
            "proveedor": "coche",
            },
            {
            "proveedor": "vuelo"
            },
            {
            "proveedor": "hotel"
            }
        ]
    });
});

//////////////////////////////////////////////////////////////////
// Obtenemos todos los usuarios de la BD
app.get('/api/usuarios', (req, res, next) => {
    var collection = db.collection("agencias");

    collection.find((err, elementos) => {
		if(err) return next(err);

		console.log(elementos);
		res.json({
				result: 'OK',
				colecciones: collection,
				elementos: elementos
		});
	});
});

//////////////////////////////////////////////////////////////////
// Obtenemos las colecciones del proveedor = req.params.proveedores
app.get('/api/:proveedores', (req ,res, next) => {
    const queProveedor = req.params.proveedores;
    
    const queURL = isProveedor(req, res, next);
    console.log(queURL);
    fetch(queURL)
    .then(res => res.json())
    .then(json => {
        res.json({
            result: json.result,
            colecciones: json.colecciones
        });
    })
    .catch(err => console.log(err));  
});

//////////////////////////////////////////////////////////////////
// Obtenemos los datos de la coleccion = req.params.colecciones del proveedor = req.params.proveedores
app.get('/api/:proveedores/:colecciones', (req, res, next) => {
    const queColeccion = req.params.colecciones;
    var queURL = isProveedor(req, res, next);

    fetch(queURL)
    .then(res => res.json())
    .then(json => {
        res.json( {
            result: json.result,
            colecciones: queColeccion,
            elemento: json.elementos
        });
    })
    .catch(err => console.log(err));
});

//////////////////////////////////////////////////////////////////
// Obtenemos la información especifica de un objeto con id = req.params.id de la coleccion = req.params.colecciones del proveedor = req.params.proveedores
app.get('/api/:proveedores/:colecciones/:id', (req, res, next) => {
    const queColeccion = req.params.colecciones;
    var queURL = isProveedor(req ,res, next);
    const queID = req.params.id;

    
    queURL += `/${queID}`;
    
    fetch(queURL)
    .then(res => res.json())
    .then(json => {
        res.json( {
            result: json.result,
            colecciones: queColeccion,
            elemento: json.elemento
        });
    })
    .catch(err => console.log(err));
});

//////////////////////////////////////////////////////////////////
// Registramos un nuevo usuario en nuestra base datos. Antes de crearlo,
// se comprueba que este no exista ya buscando en la coleccion agencias el nombre del usuario
app.post('/api/registrar', (req, res, next) => { 
    var collection = db.collection("agencias");
    const user = req.body.user;

    
    collection.findOne({"user": user}, (err, elemento) => {
        
        if(elemento != null && elemento.user == user){
            res.json(`Error: Usuario ${user} ya existente`);
        }
        else{
            createHashSalt(req, res, next);
        }
    });
 });

//////////////////////////////////////////////////////////////////
// Creamos una nueva reserva en la coleccion reservas del proveedor y en la coleccion reservas de Agencia
app.post('/api/:proveedores/:colecciones/:id/:idProv', authFRONT,(req, res, next) => {
    const queColeccion = req.params.colecciones;
    const queToken = req.params.token;
    const idObjeto = req.body.idObjeto;
    var queURL = isProveedor(req, res, next);

    var newURL;
    switch(req.params.proveedores){
        case "vuelo":
            if(queColeccion == "reservas"){
                newURL = `${URL_WS_VUELOS}` + `/reservas`;
            }
            else{
                newURL = `${URL_WS_VUELOS}` + `/vuelos`;
            }
            break;

        case "coche":
            if(queColeccion == "reservas"){
                newURL = `${URL_WS_COCHES}` + `/reservas`;
            }
            else{
                newURL = `${URL_WS_COCHES}` + `/coches`;
            }

            break;

        case "hotel":
            if(queColeccion == "reservas"){
                newURL = `${URL_WS_HOTEL}` + `/reservas`;
            }
            else{
                newURL = `${URL_WS_HOTEL}` + `/hoteles`;
            }
            
            break;

        default:
            res.json(`End-Point invalido: ${req.params.proveedores} no existe`);
    }

    if(queColeccion == "reservas"){
       
        const idUsuario = req.body.idUsuario;
        const idProveedor = req.body.idProveedor;
       
        var collection = db.collection("agencias");
  
        collection.findOne({"user": idUsuario}, (err, elemento) => {
            if(elemento == null){
                res.json("Error: id de Usuario no existe");
            }
        
            else{
         
                fetch(newURL)
                .then(res => res.json())
                .then(json => {
                                
                const nuevoElemento = {
                    idProveedor: req.body.idProveedor,
                    idUsuario: req.body.idUsuario,
                    precio: json.elementos.precio
                }

                fetch(queURL, {
                    method: 'POST',
                    body: JSON.stringify(nuevoElemento),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${queToken}`
                    }   
                })
                .then(res => res.json())
                .then(json => {
                    if(json.elemento == null)
                        res.json(json);
                        console.log({
                            result: 'OK',
                            colecciones: queColeccion,
                            elemento: json.elemento
                        });
                    
                    var collection = db.collection("reservas");
                    collection.save({_id: id(json.elemento._id), idUsuario: req.params.id, proveedor: req.params.proveedores, precio: json.elemento.precio}, (err, elementoGuardado) => {
                        if (err) return next(err);
                
                        res.status(201).json({
                            result: 'OK',
                            elemento: elementoGuardado
                        });
                    });
                })
                .catch(err => console.log(err));
                //Borrar el elemento del proveedor
                switch(req.params.proveedores){
                    case "vuelo":
                        newURL = `${URL_WS_VUELOS}` + `/vuelos`;
                        break;
            
                    case "coche":
                        newURL = `${URL_WS_COCHES}` + `/coches`;
            
                        break;
            
                    case "hotel":
                        newURL = `${URL_WS_HOTEL}` + `/hoteles`;

                        break;
            
                    default:
                        res.json(`End-Point invalido: ${req.params.proveedores} no existe`);
                }
                newURL += `/${idObjeto}`;
                console.log(newURL);
                fetch(newURL, {
                    method: 'DELETE',
                    body: JSON.stringify(nuevoElemento), 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${queToken}`
                    }
                })
                .then(res => res.json())
                .then(json => {
                    res.json({
                        resultado: 'OK',
                        colecciones: queColeccion,
                        elemento: json.elemento
                    });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    });

       
    }
    else{
        if(queColeccion == "coches" || queColeccion == "vuelos" || queColeccion == "hoteles"){
            res.status(401).json({
                result: 'KO',
                mensaje:`Lo siento, este método es unicamente para crear reservas, si deseas crear un nuevo objeto en la coleccion ${queColeccion}
                por favor utilice el método con la siguiente URI: '/api/:proveedores/:colecciones/:id`
            })
        }
        else{
            res.json("End-point inválido");
        }
    }
  
 });

app.post('/api/:proveedores/:colecciones/:id', auth, (req, res, next) => {
    const nuevoElemento = req.body;
    const queColeccion = req.params.colecciones;
    const pasarValorID = false;
    var queURL = isProveedor(req, res, next, pasarValorID);
    const queToken = req.params.token;

    fetch(queURL, {
        method: 'POST',
        body: JSON.stringify(nuevoElemento),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }    
    })
    .then(res => res.json())
    .then(json => {
        res.json({
            result: 'OK',
            colecciones: queColeccion,
            elemento: json.elemento
        });
    })
    .catch(err => console.log(err));
});

/////////////////////////////////////////////////////

app.put('/api/:proveedores/:colecciones/:id/:idProveedor', authFRONT, (req ,res, next) => {
    const queColeccion = req.params.colecciones;
    var nuevoElemento = req.body;
    const queToken = req.params.token;
    const idProveedor = req.params.idProveedor;
    const queURL = isProveedor(req, res, next);
    
    console.log(queURL, idProveedor, queColeccion);

    fetch(queURL, {
        method: 'PUT',
        body: JSON.stringify(nuevoElemento), 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
    .then(res => res.json())
    .then(json => {
        res.json({
            resultado: 'OK',
            colecciones: queColeccion,
            elemento: json.elemento
        });
    })
    .catch(err => console.log(err));
});

/////////////////////////////////////////////////////

app.delete('/api/:proveedores/:colecciones/:id/:idProveedor', auth, (req, res, next) => {
    const queColeccion = req.params.colecciones;
    var nuevoElemento = req.body;
    const queToken = req.params.token;
    const idProveedor = req.params.idProveedor;
    const queURL = isProveedor(req, res, next);

    fetch(queURL, {
        method: 'DELETE',
        body: JSON.stringify(nuevoElemento), 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${queToken}`
        }
    })
    .then(res => res.json())
    .then(json => {
        res.json({
            resultado: 'OK',
            colecciones: queColeccion,
            elemento: json.elemento
        });
    })
    .catch(err => console.log(err));
});

app.delete('/api/usuarios/:id', auth, (req, res, next) => {
    const queId = req.params.id;
    const iD = req.body;

    console.log(queId, iD);
    
    db.collection("agencias").findOne({_id: id(queId)}, (err, elem) => {
        if(elem != null){
            db.collection("agencias").remove(
				{_id: id(queId)},
				(err, resultado) => {
					if(err) return next(err)
					console.log(resultado);
					res.json({
						result: 'OK',
						coleccion: "agencias",
						resultado: resultado
					});
				}
			);
        }
        else{
            res.json({
                mensaje: "Usuario no encontrado"
            })
        }
    });
});



https.createServer(OPTIONS_HTTPS, app).listen(port, () => {
	console.log(`Secure WS API GW  del REST CRUD con DB ejecutandose en https://${miIp}:${port}/api/:colecciones/:id`);
});

/*
app.listen(port, () => {
    console.log(`WS API REST CRUD con DB ejecutandose en http://localhost:${port}/:colecciones/:id`)
});*/