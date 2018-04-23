var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var glob = require('glob');
var _ = require('lodash');

var index = require('./routes/index');
var moduleHtml = require('./routes/module-html');
var script = require('./routes/script');
var formBuilder = require('./routes/formBuilder');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var handlebars = require('./views/helpers/handlebars')(exphbs);

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// dynamically loads backend
glob.sync('esglobe_modules/**/routes/*.js').forEach(function(file) {
    const fileSplit = file.split("/");
    const moduleName = fileSplit[fileSplit.indexOf('routes') - 1];
    var dynamicController = require(`../${file}`);
    app.use(`/api/${moduleName}`, dynamicController);
    app.use(`/api/${moduleName}/script`, function(req, res, next) {
        req.moduleName = moduleName;
        next();
    }, script);
});


app.use('/', index);
app.use('/module-html', moduleHtml);
app.use('/form-builder', formBuilder);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
