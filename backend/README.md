# CMO India Hiring Platform - Backend

A comprehensive NestJS backend for the CMO India hiring platform with TypeScript, PostgreSQL, JWT authentication, and role-based access control.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Candidate, Company, Admin)
  - Password hashing with bcryptjs

- **User Management**
  - User registration and login
  - Profile management for candidates and companies
  - Admin user management

- **Job Management**
  - Job posting creation and management
  - Advanced job search with filters
  - Company job listings

- **Application System**
  - Job application submission
  - Application status tracking
  - Company application management

- **File Upload**
  - Resume upload for candidates
  - Company logo upload
  - File validation and storage

- **Admin Panel**
  - User and company management
  - Platform analytics
  - Company approval workflow

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (Passport)
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update the values:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=cmo_hiring_platform

   # Application Configuration
   NODE_ENV=development
   PORT=8000
   FRONTEND_URL=http://localhost:3000

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE_TIME=24h

   # File Upload Configuration
   UPLOAD_DEST=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Database Setup**
   
   Create a PostgreSQL database:
   ```sql
   CREATE DATABASE cmo_hiring_platform;
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- http://localhost:8000/api/docs

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `DELETE /api/users/:id` - Delete user (Admin only)

### Candidate
- `GET /api/candidate/profile` - Get candidate profile
- `PUT /api/candidate/profile` - Update candidate profile

### Company
- `GET /api/company/profile` - Get company profile
- `POST /api/company/profile` - Create company profile
- `PUT /api/company/profile` - Update company profile
- `GET /api/company/all` - Get all approved companies
- `GET /api/company/:id` - Get company by ID

### Jobs
- `GET /api/jobs` - Search jobs with filters
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job posting (Company)
- `PUT /api/jobs/:id` - Update job posting (Company)
- `DELETE /api/jobs/:id` - Delete job posting (Company)
- `GET /api/jobs/company/my-jobs` - Get company's jobs

### Applications
- `POST /api/applications` - Apply for job (Candidate)
- `GET /api/applications/candidate/my-applications` - Get candidate applications
- `GET /api/applications/company/my-applications` - Get company applications
- `GET /api/applications/job/:jobId` - Get job applications (Company)
- `PUT /api/applications/:id/status` - Update application status (Company)
- `GET /api/applications/:id` - Get application by ID
- `DELETE /api/applications/:id` - Delete application (Candidate)

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/users` - All users
- `GET /api/admin/companies` - All companies
- `GET /api/admin/companies/pending` - Pending company approvals
- `PUT /api/admin/companies/:id/approve` - Approve company
- `PUT /api/admin/companies/:id/reject` - Reject company
- `GET /api/admin/jobs` - All jobs
- `GET /api/admin/applications` - All applications
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/companies/:id` - Delete company

### Upload
- `POST /api/upload/resume` - Upload resume (Candidate)
- `POST /api/upload/logo` - Upload company logo (Company)
- `GET /api/uploads/:filename` - Get uploaded file

## Database Schema

### Users
- Basic user information
- Role-based access (candidate, company, admin)
- Authentication credentials

### Candidate Profiles
- Extended profile information for candidates
- Skills, experience, resume link
- Contact information

### Company Profiles
- Company information and branding
- Approval status for posting jobs
- Company details and description

### Jobs
- Job postings with detailed information
- Company association
- Status and application tracking

### Applications
- Job application records
- Status tracking (pending, shortlisted, rejected, accepted)
- Cover letters and notes

## User Roles & Permissions

### Candidate
- Create and manage profile
- Search and apply for jobs
- Track application status
- Upload resume

### Company
- Create and manage company profile
- Post and manage job listings
- Review and manage applications
- Upload company logo

### Admin
- Manage all users and companies
- Approve/reject company registrations
- View platform analytics
- Moderate content

## File Upload

The application supports file uploads for:
- **Resumes**: PDF, DOC, DOCX (max 5MB)
- **Company Logos**: JPG, PNG, GIF, WebP (max 5MB)

Files are stored locally in the `./uploads` directory and served via the `/api/uploads/:filename` endpoint.

## Development

### Scripts
```bash
npm run start:dev    # Start development server with hot reload
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Database Migrations
TypeORM synchronization is enabled in development mode. For production, use proper migrations:

```bash
npm run typeorm:generate-migration
npm run typeorm:run-migration
```

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Role-based route protection
- Input validation and sanitization
- File upload validation
- CORS configuration

## Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure production database

2. **Database**
   - Set `synchronize: false` in production
   - Use proper database migrations

3. **File Storage**
   - Consider using cloud storage (AWS S3, etc.)
   - Configure proper file serving

4. **Security**
   - Use HTTPS in production
   - Configure proper CORS settings
   - Set up rate limiting

## Support

For issues and questions, please contact the development team or create an issue in the repository.