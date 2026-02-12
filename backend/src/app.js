const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);

app.use((err, req, res, next) => {
  if (err.message.includes('Only .xlsx')) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
