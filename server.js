const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const db = require('./database');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
// Helmet
app.use(helmet());
// Nikto Fixes
app.use(helmet.xContentTypeOptions());
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
// CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"],
    },
  })
);

// HSTS
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
  })
);

// CORS
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST']
}));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Zyada attempts! 15 minute baad try karo.' }
});

// Token Check
function tokenCheck(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token nahi mila!' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token galat hai!' });
    req.user = user;
    next();
  });
}

// Home
app.get('/', (req, res) => {
  res.json({ message: 'Secure Server Chal Raha Hai!' });
});

// Login
app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful!', token });
  }
  res.status(401).json({ error: 'Username ya password galat hai!' });
});

// Secret Data
app.get('/secret-data', tokenCheck, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! Yeh secret data hai.` });
});

// ✅ FIXED ROUTE — Prepared Statements (SQL Injection Safe)
app.get('/user', (req, res) => {
  const id = req.query.id;
  try {
    const result = db.prepare('SELECT * FROM users WHERE id = ?').all(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CSRF Token Route — token lao
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protected Form Route — CSRF check hoga
app.post('/submit-form', csrfProtection, (req, res) => {
  res.json({ message: '✅ Form safely submit ho gaya!' });
});

// CSRF Error Handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: '❌ CSRF Attack Detected! Fake request block ho gayi!' });
  }
  next(err);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
