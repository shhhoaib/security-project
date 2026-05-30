# 🔐 Cybersecurity Internship Project — Weeks 4-6

## Overview
Secure Node.js application with advanced security implementations,
vulnerability testing, and secure Docker deployment.

## Week 4 — API Security & Hardening
- JWT Authentication System
- Rate Limiting (Brute Force Protection)
- CORS Configuration
- Security Headers (Helmet)
- Content Security Policy (CSP)
- HSTS Headers
- Fail2Ban (IP Banning System)

## Week 5 — Ethical Hacking & Fixes
- SQL Injection Testing with SQLMap
- SQL Injection Fix using Prepared Statements
- CSRF Protection using csurf middleware
- CSRF Attack Testing

## Week 6 — Security Audits & Deployment
- OWASP ZAP Scan (zap_report.html)
- Nikto Web Server Scan (nikto_report.txt)
- Lynis System Audit (Score: 62/100)
- UFW Firewall Enabled
- Automatic Security Updates
- Malware Scanner (rkhunter)
- Docker Secure Deployment

## Setup Instructions
npm install
node server.js

## Docker Setup
docker build -t security-project .
docker run -d -p 3000:3000 --name myapp security-project

## Security Tools Used
- Fail2Ban
- OWASP ZAP
- Nikto
- SQLMap
- Lynis
- Docker
- rkhunter
