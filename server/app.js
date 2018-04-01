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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({ layoutsDir: './server/views/layouts/', defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

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
});


app.use('/', index);
app.use('/module-html', moduleHtml);

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
