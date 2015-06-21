var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
		  where: { id: Number(quizId)},
		  include: [{ model: models.Comment }]
		}).then(
	function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};


// GET /quizes
exports.index = function(req, res){
	models.Quiz.findAll().then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}
	).catch(function(error) { next(error);})
};

/*exports.index = function(req, res){
    // se define un objeto vacio en caso de que el usuario no haga
    // una busqueda y se quieran mostrar todos los resultados
    var query = {};

    // si el usuario realiza una busqueda, componemos el query
    if(req.query.search) {
        var search = req.query.search;
        search = search.split(" ").join('%');
        search = '%' + search + '%';
		// en vez de utilizar LIKE se usa ordenacion directa en el query
        query = { where: ["pregunta like ?", search],
					order: 'pregunta ASC'}};
    }

    models.Quiz.findAll(query).then(
		function(quizes){
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error){ next(error);});
};*/

// GET  /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(	//crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST  /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, tema: tema, errors: err.errors});
			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta", "tema"]})
				.then(function(){ res.redirect('/quizes')})
			}	// redireccion HTTP (URL relativo) lista de preguntas
		}
	);
};

// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz, tema: req.quiz.tema, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', 
		{quiz: req.quiz, 
		respuesta: resultado, 
		errors: []});
};

// GET quizes/:id:edit
exports.edit = function (req, res) {
	var quiz = req.quiz;	//autoload de instancia de quiz
	
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

