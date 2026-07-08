const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const AppError = require('./common/AppError');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res, next) => {
  next(new AppError(`Rota ${req.originalUrl} não encontrada.`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: 'error',
    message: err.message || 'Erro interno de servidor.',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
    console.error(err);
  }

  res.status(statusCode).json(payload);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API de fideliza-mais rodando em http://localhost:${port}`);
});
