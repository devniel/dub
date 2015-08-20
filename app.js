var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig            = require('swig');
var basicAuth = require('basic-auth');
var http = require('http');

/** =========================================
 BASIC AUTHENTICATION
**/

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).end();
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'test' && user.pass === 'test') {
    return next();
  } else {
    return unauthorized(res);
  };
};

/** -- BASIC AUTHENTICATION
=========================================**/

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);

app.use(require('connect-livereload')());

app.set('views', path.join(__dirname, '/views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(express.static(path.resolve(__dirname) + "/assets"));

app.get("/logout", function(req, res){
  res.status(401).end("Hasta pronto.");
});

app.get("/", function(req, res){
  res.render("index");
});

app.get("/views/*", function(req, res){
  var routes = req.path.split("/");
  var cleaned = [];

  for(var i in routes){
    if(routes[i] != "") cleaned.push(routes[i]);
  }

  cleaned = cleaned.slice(1, cleaned.length);
  res.render(cleaned.join("/") + "/index.html");
});

var port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

console.log("Express app listen on port " + port);

module.exports = app;