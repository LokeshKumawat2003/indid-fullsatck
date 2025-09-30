require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/Db');
const errorHandler = require('./Middleware/errorHandler');

const ai = require('./controllers/aiinerview');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});


app.use("/api",ai)

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

module.exports = app;
