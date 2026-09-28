# 🛡️ OctaGuard

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?logo=prisma)

**OctaGuard** is a comprehensive Web Vulnerability Scanner and Security Dashboard designed to simplify and streamline security posture management. It provides intuitive visualizations, intelligent risk recommendations, OWASP vulnerability mappings, and automated reporting.

## ✨ Features

- 📊 **Security Dashboard**: View your security scorecard, executive summaries, and interactive risk matrices.
- 🔍 **Vulnerability Scanning**: Identify potential risks and classify them according to standard OWASP Top 10 vulnerabilities.
- 🤖 **Intelligent Scoring & Recommendations**: (Powered by Mock AI) Analyzes scan data and generates actionable remediation recommendations.
- 📄 **Automated PDF Reporting**: Generate ready-to-present, highly detailed security reports.
- 🔐 **Secure Architecture**: Built with a robust Node.js/Express backend paired with Prisma ORM.

## 💻 Tech Stack

### Frontend
- **Framework:** [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visuals & Icons:** [Recharts](https://recharts.org/), [Lucide React](https://lucide.dev/)
- **PDF Generation:** [jsPDF](https://parall.ax/products/jspdf), [html2canvas](https://html2canvas.hertzen.com/)
- **Routing:** React Router DOM

### Backend
- **Server:** Node.js, [Express](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Utilities:** Axios, CORS, Dotenv

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PurveshShinde/OctaGuard.git
   cd OctaGuard
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   # Configure your .env file
   # Start the development server
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Start the frontend application
   npm run dev
   ```

## 📂 Project Structure

```text
OctaGuard/
├── backend/
│   ├── src/           # Express server and API routes
│   ├── prisma/        # Prisma schema and migrations
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/# Reusable React components (Dashboard, Scanning, Reporting)
    │   ├── context/   # React Context for state management
    │   ├── hooks/     # Custom React Hooks
    │   ├── layouts/   # Page layouts
    │   ├── pages/     # Main views (Dashboard, ScanDetails, Settings, etc.)
    │   ├── services/  # API calls, Scoring engine, and Mock AI
    │   └── utils/     # Constants and helper functions
    └── package.json
```

## 🤝 Contributors

OctaGuard was built with ❤️ by an incredible team. A huge thanks to the people who made this project possible:

- **Purvesh Shailesh Shinde** - [@PurveshShinde](https://github.com/PurveshShinde)
- **Sanjana Santosh More** - [@Sanjana2616](https://github.com/Sanjana2616)
- **Shreya Shinde** - [@ShreyaMShinde](https://github.com/ShreyaMShinde)
- **Triveni** - [@trinalawade](https://github.com/trinalawade)

## 📄 License

This project is licensed under the ISC License.
