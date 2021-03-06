if (!process.env.IS_PRODUCTION) {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const apiRouter = require('./apis/index');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', path.join(__dirname, 'assets'));
app.use('/dist', path.join(__dirname, 'dist'));
app.use('/api', apiRouter);

app.get('/', (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    next(error);
  }
});

//maybe rethink this error handling
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`,
  });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err),
  });
});
