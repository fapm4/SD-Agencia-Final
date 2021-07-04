'use strict'

const port = process.env.PORT || 3000;
const miIp = "192.168.0.9";

const express = require('express')
const app = express()

const https = require('https')
const fs = require('fs')

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

// Conexión a la BD

const mongojs = require('mongojs');
var db = mongojs('mongodb+srv://Francisco:Kenia12345@agencia.boyzs.mongodb.net/Vuelos?retryWrites=true&w=majority');
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


///////////////////////////////////////////////////////

// Actualiza la coleccion
app.param("colecciones", (req, res, next, colecciones) => {
	console.log('middleware param /api/:colecciones');
	req.collection = db.collection(colecciones);
	return next();
});

// Middleware de autorizacion
function auth(req, res, next){
	const miToken = req.headers.authorization;
	if(!miToken){
		// Responder sin permiso
		res.status(401).json({
			result: 'KO',
			mensaje: "No se ha enviado el token de tipo Bearer en la cabecera Authorization"
		});

		return next(new Error("Falta el token de autorizacion"));
	}

	console.log(miToken);
	if(miToken.split(" ")[1] === "MITOKEN123456789"){
		return next();
	}
	
	res.status(401).json({
		result: 'KO',
		mensaje: "Acceso no autorizado a este servicio"
	});
	return next(new Error("Token de autorizacion erroneo"));


}
/////////////////////////////////////////////////////

// Obtengo las colecciones de la base de datos
app.get('/api', (req, res, next) => {
	db.getCollectionNames((err, colecciones) => {
		if(err) return next(err);
		
		console.log(colecciones);
		res.json({
			result: 'OK',
			colecciones: colecciones

		});

	});
});

// Obtengo todos los elementos de una colección
app.get('/api/:colecciones', (req, res, next) => {
	const queColeccion = req.params.colecciones;

	db.collection(queColeccion).find((err, elementos) => {
		if(err) return next(err);

		console.log(elementos);
		res.json({
				result: 'OK',
				coleccion: queColeccion,
				elementos: elementos
		});
	});
});

// Obtengo un objeto específico de la colección especificada
app.get('/api/reservas/:id', (req, res, next) => {
	const queColeccion = req.params.colecciones;
	const queId = req.params.id;

	console.log(queId, "hola");

	if(queId < 100){
		// Hay que convertir el id a objeto ID
		db.collection("reservas").findOne({"idProveedor": queId}, (err, elemento) =>{
			if(err) return next(err);

			console.log(elemento);
			res.json({
					result: 'OK',
					colecciones: queColeccion,
					elemento: elemento
			});
		});
	}
	else{
		db.collection("reservas").findOne({"idUsuario": queId}, (err, elemento) =>{
			if(err) return next(err);

			console.log(elemento);
			res.json({
					result: 'OK',
					colecciones: queColeccion,
					elemento: elemento
			});
		});
	}
});


// Obtengo un objeto específico de la colección especificada
app.get('/api/:colecciones/:id', (req, res, next) => {
	const queColeccion = req.params.colecciones;
	const queId = req.params.id;

	// Hay que convertir el id a objeto ID
	db.collection(queColeccion).findOne({ _id: id(queId)}, (err, elemento) =>{
		if(err) return next(err);

		console.log(elemento);
		res.json({
				result: 'OK',
				colecciones: queColeccion,
				elemento: elemento
		});
	});
});

app.get('/api/reservas/:id', auth, (req, res, next) => {
	const queId = req.params.id;
	var collection = db.collection("reservas");

	collection.save({ 'id': queId}, (err, elemento) => {
		console.log(elemento);

		res.status(201).json({
			result: 'OK',
			elemento: elemento
		});
	});
});

app.post(('/api/:coleccion'), auth, (req, res, next) => {
	const nuevoElemento = req.body;
	const queColeccion = req.params.coleccion;

	if(queColeccion == "reservas"){
		console.log(nuevoElemento.idProveedor);
		const queId = JSON.stringify(nuevoElemento.idProveedor);
		
		console.log(queId);
		db.collection(queColeccion).findOne({"idProveedor": nuevoElemento.idProveedor}, (err, elemento) => {
			if(elemento != null && elemento.idProveedor == nuevoElemento.idProveedor){
				res.json({
					result: 'KO',
					coleccion: queColeccion,
					mensaje: 'Error: reserva ya realizada'
				});
			}
			else{
				db.collection(queColeccion).save( nuevoElemento, (err, elementoGuardado) => {
					if(err) return next(err);
			
					console.log(elementoGuardado);
					res.status(201).send(
						{
							coleccion: queColeccion,
							elemento: elementoGuardado
						}
					);
				});
			}
		});
	}
	else{
		db.collection(queColeccion).save( nuevoElemento, (err, elementoGuardado) => {
			if(err) return next(err);
	
			console.log(elementoGuardado);
			res.status(201).send(
				{
					coleccion: queColeccion,
					elemento: elementoGuardado
				}
			);
		});
	}
});

app.put(('/api/:coleccion/:id'), auth, (req, res, next) => {
	const queId = req.params.id;
	const idReserva = req.body.idReserva;
	const queColeccion = req.params.coleccion;
	const nuevoElemento = req.body;

	db.collection(queColeccion).find({"idProveedor": queId}, (err, elemento) => {
		if(elemento != null){
			console.log(elemento);
			db.collection(queColeccion).update(
				{_id: id(idReserva)},
				{$set: nuevoElemento},
				{safe: true, multi: false},
				(err, resultado) => {
					if(err) return next(err)

					console.log(resultado);

					res.json({
						result: 'OK',
						coleccion: queColeccion,
						resultado: resultado
					});
				}
			);
		}
		else{
			res.json({
				mensaje: "ID de proveedor erróneo"
			});
		}
	});	
});

app.delete(('/api/:coleccion/:id'), auth, (req, res, next) => {
	const queId = req.params.id;
	const idReserva = req.body.idReserva;
	const queColeccion = req.params.coleccion;
	const nuevoElemento = req.body;

	db.collection(queColeccion).find({"idProveedor": queId}, (err, elemento) => {
		if(elemento != null){
			console.log(elemento);
			db.collection(queColeccion).remove(
				{_id: id(idReserva)},
				(err, resultado) => {
					if(err) return next(err)

					console.log(resultado);

					res.json({
						result: 'OK',
						coleccion: queColeccion,
						resultado: resultado
					});
				}
			);
		}
		else{
			res.json({
				mensaje: "ID de proveedor erróneo"
			});
		}
	});
});

https.createServer(OPTIONS_HTTPS, app).listen(port, () => {
	console.log(`Secure WS API REST CRUD con DB ejecutandose en https://${miIp}:${port}/api/:colecciones/:id`);
});

