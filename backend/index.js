require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/Db');

const ai = require('./controllers/aiinerview');
const codeediter = require('./controllers/codeEditr');
const authRoutes = require('./routes/authRoutes');
const Jobpost = require('./routes/jobpost.Route');
const userAccountRoutes = require('./routes/userAccount');
const applicationRoutes = require('./routes/application');
const errorHandler = require('./middlewares/error.middleware');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"]
  }
}));
app.use(morgan('dev'));

app.use((req, res, next) => {
  // console.log('Request Headers:', req.headers);
  // console.log('Request Body:', req.body);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: "Server is running" });
});


app.use("/api", ai)
app.use("/api", codeediter)
app.use('/api/auth', authRoutes)
app.use('/api/post', Jobpost)
app.use('/api/userAccount', userAccountRoutes)
app.use('/api/application', applicationRoutes)

app.use(errorHandler); // This should be the last middleware

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
