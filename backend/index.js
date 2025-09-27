require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/Db');
const errorHandler = require('./Middleware/errorHandler');

const PORT = process.env.PORT || 5000;

// ----- Express App Setup -----
const app = express();

// Security & parsing middlewares
app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));
app.use(express.json({ limit: '10kb' })); // Prevent huge payloads
app.use(morgan('dev')); // Logging

// ----- Test Route -----
app.get('/', (req, res) => {
  res.json({ 
    message: "Server is running"
  });
});

// ----- Error Handling Middleware -----
app.use(errorHandler);

// ----- Start Server After DB Connection -----
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1); // Stop server if DB connection fails
  });
