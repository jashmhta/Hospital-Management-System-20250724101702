# Hospital Management System (HMS)

[![Build Status](https://github.com/jashmhta/Hospital-Management-System/workflows/CI/badge.svg)](https://github.com/jashmhta/Hospital-Management-System/actions)
[![Coverage](https://codecov.io/gh/jashmhta/Hospital-Management-System/branch/main/graph/badge.svg)](https://codecov.io/gh/jashmhta/Hospital-Management-System)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HIPAA Compliant](https://img.shields.io/badge/HIPAA-Compliant-green.svg)](docs/compliance/hipaa.md)

> **Enterprise-grade Hospital Management System with complete microservices architecture, HIPAA compliance, and advanced EHR capabilities.**

## 🏥 Overview

The Hospital Management System (HMS) is a comprehensive, production-ready healthcare management platform designed for modern hospitals and healthcare facilities. Built with enterprise-grade security, scalability, and compliance in mind.

### ✨ Key Features

- **🔐 HIPAA/GDPR Compliant** - Complete regulatory compliance with audit trails
- **🏗️ Microservices Architecture** - 7 independently scalable services
- **📋 Electronic Health Records** - Complete patient data management
- **🎯 Quality Management** - NABH/JCI accreditation support
- **🔢 ICD-10 Coding** - Advanced medical coding system
- **🔒 Multi-Factor Authentication** - Enterprise security with JWT/MFA
- **📱 Real-time Notifications** - SMS/Email/WhatsApp integration
- **📊 Advanced Analytics** - Business intelligence and reporting

## 📚 Comprehensive Documentation

For complete and up-to-date information on the Hospital Management System, including detailed architecture, API documentation, development guidelines, security, and compliance, please refer to the [Comprehensive Documentation](comprehensive_documentation.md).

This document serves as the single source of truth for the entire project, consolidating all relevant information previously scattered across multiple files.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose

### Installation

```bash
# 1. Clone repository
git clone https://github.com/jashmhta/Hospital-Management-System.git
cd Hospital-Management-System

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start services
docker-compose up -d

# 5. Run migrations
npm run db:migrate

# 6. Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See the [Comprehensive Documentation](comprehensive_documentation.md#development--operations) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Comprehensive Documentation](comprehensive_documentation.md)
- **Issues**: [GitHub Issues](https://github.com/jashmhta/Hospital-Management-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jashmhta/Hospital-Management-System/discussions)

---

**Hospital Management System** - Built with ❤️ for healthcare excellence.


