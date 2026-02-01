const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS Middleware - Must be first
app.use(cors()); // Allow all origins for development

// Security Middleware
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Compression Middleware
app.use(compression());

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply rate limiting to all requests
app.use(limiter);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workspaces', require('./routes/workspaceRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
