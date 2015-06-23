var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));  //seria mejor si fuera aleatorio
app.use(session());
app.use(partials());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//tiempo de sesion: solucion basada en Juan Ignacio Gil Palacios
 app.use(function(req, res, next) {
	// si el usuario se ha logeado, entonces comienza a funcionar
	if(req.session.user){					
		// Si no existe la variables local 'tiempoExpiracion' la inicializa
		// si, ya existe comprueba si se ha sobrepasado el tiempo asignado sin actividada
        if(!req.session.tiempoExpiracion){		
			// iniicialilza la variable 'tiempoExpiracion' con el valor del tiempo de acceso actual
            req.session.tiempoExpiracion=(new Date()).getTime();
        }else{
			// Si ya esta la marca de tiempo con la variable 'tiempoExpiracion'
			// comprueba si se ha sobrepasado el tiempo de 2mm (120000 milisegundos)
            if((new Date()).getTime()-req.session.tiempoExpiracion > 120000){	
				// si se ha sobrepasado el tiempo de sesion sin utilización
				// se elimina la sesion del usuario
				delete req.session.user;     	
            }else{		
				// si hay activiadad, se vuelve a actualizar la variable 'tiempoExpiracion'
				// es decir, se resetea el contador para volver a comenzar el conteo de utilización
                req.session.tiempoExpiracion=(new Date()).getTime();
            }
        }
    }
    next();
});

// Helpers dinamicos
app.use(function(req, res, next) {

	// guardar path en session.redir para despues de login
	if (!req.path.match(/\/login|\/logout/)){
		req.session.redir = req.path;
	}
	
	// Hacer visible req.session en las vistas
	res.locals.session = req.session;
	next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err, 
			errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, 
		errors: []
    });
});

module.exports = app;
