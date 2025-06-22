# LearnHub Backend - Learning Management System (LMS)

This is the backend API for **LearnHub**, a full-featured Learning Management System (LMS) that allows instructors to manage courses, and students to enroll,  and access video content.

Built with **Node.js**, **Express.js**, and **MongoDB**, the backend supports secure authentication, payments, file uploads, email notifications, and a RESTful API structure.

🔗 **Frontend Repository**: [https://github.com/Roshan21p/LMS-Frontend](https://github.com/Roshan21p/LMS-Frontend)  
🔗 **Live Backend URL**: [https://lms-backend-wwa3.onrender.com](https://lms-backend-wwa3.onrender.com/ping)

> ⚠️ Render may take 30–40 seconds to wake up if idle.

---

##  Features

- API versioning using `/api/v1`
- JWT-based authentication and role-based authorization
- Forgot password and reset password functionality via email
- Error handling with centralized middleware
- Manual input validation
- Course creation API with video and image uploads (Cloudinary integration)
- Email notifications and communication via Nodemailer
- Secure payment integration with Razorpay (subscription model)
- Environment-based configuration using `.env`

---

## 💻 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Roshan21p/LMS-Backend.git
cd LMS-Backend
```
### 2. Install dependencies
```bash
npm install
```
### 3. To run the project, use the following command
```bash
npm start
```
### 4 Backend .env
Create a .env file in the root of LMS-Backend
```bash
PORT=3000
FRONTEND_URL=http://localhost:5173

# Add your actual credentials below:
DB_URL=DB_URL=mongodb+srv://<your-mongo-credentials>.oqsvz.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=your_jwt_secret
JWT_EXPIRY= expiry_time

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=your_email

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_PLAN_ID=your_plan_id

CONTACT_US_EMAIL=your_email
```

##  API Documentation (Postman)

You can test the API using the official Postman collection.

📁 **Postman Collection (GitHub)**:  
[View or Download LearnHub Postman Collection](https://github.com/Roshan21p/LMS-Backend/blob/main/LMS.postman_collection.json)

> This collection includes all major routes such as authentication, courses, payments, and user management.

 > Note: This collection is configured to use `http://localhost:3000/api/v1`.<br/>
 > Make sure the backend is running locally or update the base URL to your deployed backend.

---

## ESLint Setup
[ESLint setup article](https://medium.com/@sindhujad6/setting-up-eslint-and-prettier-in-a-node-js-project-f2577ee2126f)
