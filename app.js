require('dotenv').config();
const express = require('express');
const cors = require('cors');
const noteRoutes = require('./src/routes/noteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Job Notes API Running staging version try 3');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`);
});

