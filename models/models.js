var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // Exportar definición de la tabla Quiz

// sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().success(function () {
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function (count){
		if(count === 0) {   // la tabla se inicializa si esta vacia
				Quiz.create({	pregunta: 'Capital de Italia',
								respuesta: 'Roma'
							})
				.success(function(){console.log('Base de datos inicializada)});
		};
	});
});