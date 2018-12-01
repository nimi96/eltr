var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var multer = require('multer');  
//var upload = multer({ dest: './uploads' });
var config = require('./config/database'); 
require('./global_constant');
require('./text_setting');
const errorHandler = require('./helpers/error-handler');

var api = require('./routes/api');
var webServiceApi = require('./webservice/webServiceApi');
var app = express();  
app.set("view engine", "jade");
  
mongoose.Promise = require('bluebird'); 
mongoose.connect(config.database, {promiseLibrary: require('bluebird'), useNewUrlParser: true,useCreateIndex: false, })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
  
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(passport.initialize());

app.use(logger('dev')); 
//

//app.use(upload.array());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'dist/eltar'))); 
app.use('/login', express.static(path.join(__dirname, 'dist/eltar')));  
app.use('/api', api); 
app.use('/mobile',webServiceApi); 


 // global error handler
app.use(errorHandler);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/eltar', 'index.html'));
});

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
	res.sendStatus(err.status);
});

module.exports = app;