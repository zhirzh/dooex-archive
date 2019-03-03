const path = require('path');

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

const BUILD_DIR = path.resolve(__dirname, '..', 'client', 'build');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(BUILD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/doodles', routes.doodles);
app.use('/tunnel', routes.tunnel);

app.get(
  [
    '/',
    '/index.html',
    '/expo/:doodleId',
    '/info/:doodleId',
    '/saved',
    '/search',
    '/time-travel',
  ],
  (_, res) => {
    res.sendFile(path.resolve(BUILD_DIR, 'index.html'));
  },
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end('error');
});

module.exports = app;
