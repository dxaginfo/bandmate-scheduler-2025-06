# BandMate Rehearsal Scheduler

A comprehensive web application designed to simplify the process of scheduling and managing band rehearsals. BandMate helps bands coordinate rehearsal times, track attendance, send automated reminders, and suggest optimal rehearsal times based on member availability.

## Features

### User Management
- User registration and authentication system
- User profile management with instrument/role specification
- Band creation and member management
- Role-based permissions (band admin, member, crew)

### Scheduling System
- Create, edit and delete rehearsal events
- Recurring event scheduling
- Availability tracking system
- Conflict detection and resolution
- Location management for rehearsals

### Attendance Tracking
- RSVP system for rehearsals
- Attendance history and reporting
- Absence management system

### Smart Scheduling
- Optimal rehearsal time suggestions based on member availability
- Automated scheduling based on preferred parameters
- Calendar integration (Google Calendar, iCal)

### Rehearsal Management
- Setlist creation and management
- Song library with details and attachments
- Rehearsal notes and feedback

### Notifications
- Email and in-app notifications
- Customizable reminder system
- Real-time updates for schedule changes

## Technology Stack

### Frontend
- **Framework**: React.js
- **State Management**: Redux
- **UI Library**: Material-UI
- **Calendar Component**: FullCalendar
- **Form Handling**: Formik with Yup validation
- **API Client**: Axios

### Backend
- **Framework**: Node.js with Express
- **Authentication**: JWT with bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Email Service**: Nodemailer with SMTP integration
- **Validation**: Joi

### Database
- **Database System**: PostgreSQL
- **ORM**: Sequelize
- **Migrations**: Sequelize CLI

### DevOps & Deployment
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: AWS (EC2 or Elastic Beanstalk)
- **Domain & SSL**: Route 53 with ACM
- **Storage**: AWS S3 (for attachments)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Docker (optional, for containerized development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dxaginfo/bandmate-scheduler-2025-06.git
   cd bandmate-scheduler-2025-06
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   - Create `.env` files in both the server and client directories based on the provided `.env.example` files

4. **Set up the database**
   ```bash
   # Create the database
   createdb bandmate_dev
   
   # Run migrations
   cd ../server
   npx sequelize-cli db:migrate
   
   # (Optional) Seed initial data
   npx sequelize-cli db:seed:all
   ```

5. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend development server (from client directory)
   cd ../client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the containerized application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── services/     # API service calls
│       ├── store/        # Redux store configuration
│       └── utils/        # Utility functions
├── server/               # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── migrations/           # Database migrations
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/dxaginfo/bandmate-scheduler-2025-06](https://github.com/dxaginfo/bandmate-scheduler-2025-06)
