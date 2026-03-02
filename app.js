const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const noteRoutes = require('./src/routes/noteRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/notes', noteRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;