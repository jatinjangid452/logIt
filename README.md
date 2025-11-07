🧾 README.md — IT Log Book with Task Rating & Evaluation System
# 🧰 IT Log Book with Task Rating & Evaluation System

A full-stack web-based platform designed to help IT teams record, manage, and evaluate their daily activities, incidents, and maintenance tasks.  
It provides role-based access for Admins, Managers, and Technicians, enabling transparent performance tracking, accountability, and productivity analytics.

---

## 📌 Project Overview

The **IT Log Book System** replaces manual or fragmented records with a centralized digital solution.  
It allows technicians to log daily tasks, while managers can evaluate and rate those tasks for quality and effectiveness.

This promotes:
- Better communication within IT teams  
- Data-driven insights for performance improvement  
- Streamlined task monitoring and evaluation

---

## 🎯 Objectives

- Provide a **digital log** for IT activities  
- Enable **task rating and feedback** for performance tracking  
- Support **role-based access** and permissions  
- Facilitate **data-driven decision-making** through reports and analytics

---

## 🌟 Key Features

### 🧾 Log Entry Management
- Create, edit, and delete IT log entries  
- Fields include:
  - **Task Type:** Incident, Maintenance, Update  
  - **Description** and **Date/Time**  
  - **Related Ticket ID** (optional)
- Logs are linked to the technician performing the task
- Each entry is timestamped and trackable

---

### ⭐ Task Rating & Evaluation
- Managers and authorized users can:
  - Rate tasks on a **1–5 star scale**
  - Provide **written feedback/comments**
  - Edit or update evaluations later
- Average rating per task and technician displayed
- Technicians can view their received feedback

---

### 👥 User Roles & Permissions

| Role | Permissions |
|------|--------------|
| **Admin** | Full control — manage users, roles, logs, and reports |
| **Manager** | Evaluate tasks, view all logs, generate reports |
| **Technician** | Create and manage own logs, view own ratings |
| **Viewer** | Read-only access to logs and evaluations |

---

### 🔍 Search & Filtering
- Search logs by keywords or ticket IDs  
- Filter by:
  - Date range  
  - Technician name  
  - Task type  
  - Rating score  
- Sort results by **date**, **rating**, or **technician**

---

### 📈 Reports & Analytics
- Dashboard includes:
  - Total tasks logged (by date range)
  - Average rating per technician
  - Pending evaluations
  - Trends and summary charts
- Export reports as **CSV** or **PDF**

---

### 🔔 Notifications
- Managers notified of tasks pending evaluation  
- Technicians notified when their tasks are rated  
- Configurable via **email** or **in-app alerts**

---

## ⚙️ Technical Specifications

### 🧩 Tech Stack
**Frontend:** React.js + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB (Mongoose ORM)  
**Authentication:** JWT (JSON Web Token)  
**Hosting:** AWS / Render / Heroku  

---

### 🗄️ Database Schema (Key Tables)

#### Users
| Field | Type | Description |
|--------|------|-------------|
| user_id | ObjectId | Unique user identifier |
| name | String | Full name |
| email | String | User email |
| role | String | Role (Admin/Manager/Technician) |
| password_hash | String | Encrypted password |
| created_at | Date | User creation date |

#### Log_Entries
| Field | Type | Description |
|--------|------|-------------|
| log_id | ObjectId | Unique log entry |
| user_id | ObjectId | Linked to technician |
| project_id | ObjectId | Related project |
| task_type | String | Incident / Maintenance / Update |
| description | String | Task details |
| date_time | DateTime | When task occurred |
| related_ticket | String | Optional ticket ID |

#### Task_Ratings
| Field | Type | Description |
|--------|------|-------------|
| rating_id | ObjectId | Unique rating entry |
| log_id | ObjectId | Linked to log entry |
| rater_id | ObjectId | Manager who rated |
| rating_value | Number | 1–5 stars |
| comments | String | Feedback comments |
| rated_at | DateTime | When rated |

---

## 🧰 Security & Validation

- Passwords securely hashed  
- Role-based access control (RBAC)  
- Input validation & sanitization  
- Protection against SQL/NoSQL injection  
- Audit logs for actions (create/edit/delete)

---

## 🖥️ User Interface Overview

| Section | Description |
|----------|-------------|
| **Dashboard** | Overview of logs, ratings, and pending items |
| **Project Form** | Create or edit projects and assign technicians |
| **Log Entry Form** | Add daily logs and select task type |
| **Rating Panel** | Add/edit ratings and feedback |
| **Reports Page** | Visual charts and downloadable reports |

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Install Dependencies

Frontend

cd client
npm install


Backend

cd server
npm install

3️⃣ Configure Environment Variables

Create a .env file in /server with:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run the Application

Start backend:

cd server
npm start


Start frontend:

cd client
npm run dev

📊 Future Enhancements

Task completion tracking via percentage

Role-based dashboard layouts

AI-powered performance suggestions

Email-based weekly summary reports

Dark mode UI

👨‍💻 Developed By

Jatin Jangid
Full Stack Developer
📍 Jodhpur Rajasthan India
