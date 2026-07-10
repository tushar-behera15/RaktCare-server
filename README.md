# RaktCare Server

Welcome to the backend repository for **RaktCare**, a professional blood donation management system. The server provides a robust set of APIs to handle donors, hospitals, authentication, and more. It is built using Node.js, Express, TypeScript, and MongoDB.

## 🚀 Tech Stack

- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Email Service**: Nodemailer (for OTP verification)

## 🎯 Features

### 1. Authentication
- User registration and login functionality.
- Secure password hashing using `bcryptjs`.
- Email-based OTP verification using `Nodemailer` with professional HTML templates.
- Protected routes using JWT authentication middleware.

### 2. Donor Management
- **Create Profile**: Donors can securely set up their profile.
- **Update Profile**: Update health details like weight, hemoglobin, availability, and last donation date.
- **Retrieve Profile(s)**: Fetch specific donors by ID or get a list of all available donors.

### 3. Hospital Management
- **Create Profile**: Hospitals can register their facility, including license & registration numbers.
- **Update Profile**: Modify operational details, addresses, and verification statuses.
- **Retrieve Profile(s)**: Fetch a specific hospital by ID or list all registered hospitals.

### 4. Security & Validation
- Robust request payload validation utilizing `Zod` schemas.
- Sanitized database updates.
- Unknown payload fields are rigorously stripped before processing.

## 📁 Project Structure

```
├── src
│   ├── controllers     # Route controllers (auth, donor, hospital)
│   ├── middlewares     # JWT Auth and Zod validation middlewares
│   ├── models          # Mongoose schemas (Donor, Hospital, User)
│   ├── routes          # API endpoints (auth.route.ts, donor.route.ts, hospital.route.ts)
│   ├── validators      # Zod validation schemas
│   ├── server.ts       # Main application entry point
│   └── app.ts          # Express app configuration
├── .env                # Environment variables (not tracked)
├── .gitignore          # Ignored files configuration
├── package.json        # Project dependencies & scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tushar-behera15/RaktCare-server.git
   cd RaktCare-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

4. **Run the Server**
   - For development (using `tsx watch`):
     ```bash
     npm run dev
     ```
   - For production (build and run):
     ```bash
     npm run build
     npm start
     ```

## 📝 Recent Updates

- ✅ **OTP Verification Logic:** Added secure email-based OTP verification with Nodemailer.
- ✅ **Donor Controller:** Fixed routing constraints and updated donor fetching logic.
- ✅ **Hospital Controller:** Fixed issues with `isVerified` field updates (handled Zod schema stripping), and added `getAllHospitals` and `getHospitalById` endpoints.
- ✅ **Git & GitHub Integration:** Setup `.gitignore` and initialized tracking for the main branch.

---

*Designed and Developed for RaktCare.*
