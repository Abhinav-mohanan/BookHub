# 📚 BookHub

A full-stack Library Management Application designed to streamline book borrowing, inventory tracking, and user management. Built with a modern tech stack featuring React on the frontend and Django REST Framework on the backend, this system ensures secure, role-based access for both library users and admins.

## Features

### Authentication & Security
* **Role-Based Access Control (RBAC):** Distinct workflows and permissions for `Admin` and `User` roles.
* **JWT Authentication:** Secure login and session management using JSON Web Tokens.
* **Admin Approval System:** New administrator accounts remain inactive until verified and approved by an existing admin.

### User Portal
* **Account Management:** Users can register, log in, and seamlessly edit their profile details.
* **Catalog Browsing:** View the complete list of available books.
* **Borrow & Return:** Users can borrow books (enforced by a maximum borrow limit) and return them when finished.
* **Transaction History:** Dedicated dashboard to view currently borrowed books and past reading history.

### Admin Dashboard
* **Inventory Management:** Add new book entries, edit existing details, and define total available quantities.
* **User Oversight:** View all registered users and their current statuses.
* **Transaction Tracking:** Monitor comprehensive borrowing history and completed returns.
* **Admin Management:** Review and approve pending administrative accounts.

## Tech Stack

### Backend
| Component | Technology |
| :--- | :--- |
| **Framework** | Django & Django REST Framework (DRF) |
| **Database** | PostgreSQL |
| **Authentication** | Simple JWT |


### Frontend
| Component | Technology |
| :--- | :--- |
| **Framework** | React (Vite) |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |


## 🔧 Installation & Setup

### Prerequisites
- Node.js and npm (for frontend)
- Python and pip (for backend)
- PostgreSQL database

### 1️⃣ Backend (Django)

```bash

# Clone the repository
git clone https://github.com/Abhinav-mohanan/BookHub.git
cd backend/BookHub

# Create virtual environment
python -m venv env
source env/bin/activate   # or env\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 2️⃣ Frontend (React)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies:
npm install

# Start the development server
npm run dev
```

### Environment Variables
Create a .env file in backend directory with the following configurations:

```bash
# General
DEBUG=True # Set False in production
SECRET_KEY=your_django_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1,api.yourdomain.com

# Database
MY_PSQL_DB=postgres://username:password@host:port/db_name

# Third-Party Services
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
CSRF_TRUSTED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com

# Other Configuration
OTP_EXPIRY_MIN=5
MAX_BORROW_LIMIT=3

```

## 👨‍💻 Author
Abhinav Mohanan  
*Software Engineer*  

📧 Email: abhinavmohanan018@gmail.com
