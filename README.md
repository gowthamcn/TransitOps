# 🚚 TransitOps
### Smart Transport Operations Platform

<p align="center">

![GitHub Repo stars](https://img.shields.io/github/stars/gowthamcn/TransitOps?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/gowthamcn/TransitOps?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success?style=for-the-badge)

</p>

---

# 📌 Overview

**TransitOps** is a modern Fleet Management and Transport Operations Platform developed for the **Odoo Hackathon**.

The platform enables organizations to efficiently manage:

- 🚛 Fleet Vehicles
- 👨‍✈️ Drivers
- 🛣 Trips
- 🛠 Vehicle Maintenance
- ⛽ Fuel Expenses
- 📊 Operational Reports
- 🔐 Secure Authentication & Role-Based Access

TransitOps provides a centralized dashboard that allows fleet managers to monitor the entire transportation ecosystem in real time.

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- JWT Authentication
- Password Encryption using bcrypt
- Protected API Routes
- Role-Based Access Control (RBAC)

---

## 📊 Dashboard

- Active Vehicles
- Available Vehicles
- Vehicles Under Maintenance
- Active Trips
- Pending Trips
- Drivers On Duty
- Fleet Utilization
- Dashboard Filters
  - Vehicle Type
  - Vehicle Status
  - Region

---

## 🚚 Vehicle Management

- Add Vehicle
- Update Vehicle
- Delete Vehicle
- Vehicle Search
- Vehicle Status Management
- Vehicle Assignment
- Pagination
- Filtering

---

## 👨‍✈️ Driver Management

- Add Driver
- Edit Driver
- Delete Driver
- Driver Availability
- Driver Assignment
- Search
- Pagination

---

## 🛣 Trip Management

- Create Trips
- Assign Vehicle
- Assign Driver
- Trip Status Tracking
- Active Trips
- Pending Trips
- Completed Trips

---

## 🛠 Maintenance Management

- Schedule Maintenance
- Update Maintenance Status
- Maintenance History
- Vehicle Maintenance Tracking

---

## ⛽ Reports & Fuel Analytics

- Fuel Expense Tracking
- Fuel Consumption Reports
- Fleet Performance Reports
- Operational Analytics

---

# 🏗 System Architecture

```
                    React Frontend
                          │
                          │ REST API
                          ▼
                  Express.js Backend
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     Authentication    Business Logic   Reports
          │               │               │
          └───────────────┼───────────────┘
                          │
                     MongoDB Database
```

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- React Toastify
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Mongoose

---

## Database

- MongoDB Atlas

---

## Tools

- Git
- GitHub
- VS Code
- Postman / Thunder Client

---

# 📂 Project Structure

```
TransitOps
│
├── backend
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── app.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# 🔐 Authentication Flow

```
User Login
     │
     ▼
Backend Validation
     │
     ▼
Password Verification
     │
     ▼
JWT Token Generation
     │
     ▼
Token Stored
     │
     ▼
Protected Routes Accessible
```

---

# 📊 Dashboard Metrics

The Dashboard provides an overview of:

- Active Vehicles
- Available Vehicles
- Vehicles in Maintenance
- Active Trips
- Pending Trips
- Drivers On Duty
- Fleet Utilization

with support for:

- Vehicle Type Filter
- Status Filter
- Region Filter

---

# 🔑 Role Based Access Control

Supported Roles

- Admin
- Fleet Manager
- Driver

Permissions are managed through JWT middleware and protected backend routes.

---

# 🌐 API Endpoints

## Authentication

```
POST /api/auth/login

POST /api/auth/register
```

---

## Dashboard

```
GET /api/dashboard
```

---

## Vehicles

```
GET /api/vehicles

POST /api/vehicles

PUT /api/vehicles/:id

DELETE /api/vehicles/:id
```

---

## Drivers

```
GET /api/drivers

POST /api/drivers

PUT /api/drivers/:id

DELETE /api/drivers/:id
```

---

## Trips

```
GET /api/trips

POST /api/trips

PUT /api/trips/:id

DELETE /api/trips/:id
```

---

## Maintenance

```
GET /api/maintenance

POST /api/maintenance

PUT /api/maintenance/:id

DELETE /api/maintenance/:id
```

---

## Reports

```
GET /api/reports

GET /api/reports/dashboard

GET /api/reports/fuel
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/gowthamcn/TransitOps.git
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# ⚙ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---


# 🎯 Future Enhancements

- Live Vehicle Tracking
- GPS Integration
- Google Maps API
- Predictive Maintenance
- Fuel Optimization using AI
- Driver Performance Analytics
- Notification System
- Mobile Application
- Real-time Socket Communication
- Odoo ERP Integration

---

# 👥 Team

| Member | Responsibility |
|---------|---------------|
| Member 1 | Authentication, RBAC, Dashboard |
| Member 2 | Vehicle & Driver Management |
| Member 3 | Trip & Maintenance Management |
| Member 4 | Reports & Fuel Analytics |

---

# 🏆 Developed For

**Odoo Hackathon**

Building a smarter, more efficient transport operations platform through modern web technologies.

---

<p align="center">

### ⭐ If you like this project, consider giving it a star!

Made with ❤️ by Team TransitOps

</p>
