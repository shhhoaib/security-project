const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(helmet());

// CSP — Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],      // Sirf apni website se content
      scriptSrc: ["'self'"],       // Sirf apni scripts chalein
      styleSrc: ["'self'"],        // Sirf apni CSS
      imgSrc: ["'self'", "data:"], // Sirf apni images
      frameAncestors: ["'none'"],  // Koi iframe nahi
    },
  })
);

// HSTS — HTTPS force karo
app.use(
  helmet.hsts({
    maxAge: 31536000,        // 1 saal
    includeSubDomains: true,
  })
);
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST']
}));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Zyada attempts! 15 minute baad try karo.' }
});

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

app.get('/', (req, res) => {
  res.json({ message: 'Secure Server Chal Raha Hai!' });
});

app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful!', token });
  }
  res.status(401).json({ error: 'Username ya password galat hai!' });
});

app.get('/secret-data', tokenCheck, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! Yeh secret data hai.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
