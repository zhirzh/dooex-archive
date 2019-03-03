import path from 'path';

import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import doodles from '@/routes/doodles';
import tunnel from '@/routes/tunnel';

import '@/browser-polyfill';
import reactApp from '@/modules/react-app';

import { BUILD_DIR, PUBLIC_DIR } from '@/paths';

process.on('unhandledRejection', (err, p) => {
  console.log('Unhandled Rejection at: Promise', p);

  throw err;
});

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression({ threshold: 0 }));

app.get('*', reactApp); // before `static BUILD_DIR` to prevent serving `index.html`

app.use(express.static(BUILD_DIR));
app.use(express.static(PUBLIC_DIR));

app.use('/doodles', doodles);
app.use('/tunnel', tunnel);

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
  res.send('error');
});

export default app;
