# NexusCore API Suite 🚀

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com/)
[![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/MohamedBrzan/ApexAPI.git)
[![CI/CD](https://github.com/MohamedBrzan/ApexAPI.git/actions/workflows/main.yml/badge.svg)](https://github.com/MohamedBrzan/ApexAPI.git/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A scalable REST API backend system with modern authentication, role-based access control, and Redis caching. Built to demonstrate production-grade architecture and best practices.

<!-- **Live Demo**: [https://nexuscore.herokuapp.com/api-docs](https://nexuscore.herokuapp.com/api-docs)
**Postman Collection**: [![Run in Postman](https://run.pstmn.io/button.svg)](https://your-postman-link) -->

## Features ✨

- **JWT Authentication** with refresh tokens
- **Role-Based Access Control** (Admin/User/Guest)
- Redis caching for high-traffic endpoints
- Request validation and sanitization
- Pagination, filtering, and sorting
- Rate limiting (100 requests/minute)
- Swagger API documentation
- Dockerized microservices
- 95% Test coverage (Jest + Supertest)

## Tech Stack 🛠️

**Core**  
<img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" height="20">  
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" height="20">  
<img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" height="20"> <img src="https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=white" height="20">

**Security**  
Helmet | CORS | bcrypt | rate-limiter-flexible | express-validator

## Quick Start 🚦

### Prerequisites

- Node.js 18.x
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/MohamedBrzan/ApexAPI.git
cd Apex-API

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update .env with your credentials

# Start development server
npm run dev
```
