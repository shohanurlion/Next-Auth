# File Organization

This document explains how the password reset functionality is organized across different files in the project.

## Frontend Pages

### Forgot Password Page
- **Location**: `src/app/forgot-password/page.tsx`
- **Purpose**: Allows users to request a password reset by entering their email
- **Key Features**:
  - Email input form
  - Form validation
  - API integration with forgot password endpoint
  - Success message and resend functionality

### Reset Password Page
- **Location**: `src/app/reset-password/page.tsx`
- **Purpose**: Allows users to set a new password using a token from their email
- **Key Features**:
  - Token validation from URL parameters
  - Password and confirmation input
  - Password matching validation
  - API integration with reset password endpoint
  - Success redirection

## Backend API Routes

### Forgot Password API
- **Location**: `src/app/api/users/forgotpassword/route.ts`
- **Purpose**: Handles forgot password requests and sends reset emails
- **Key Functions**:
  - User existence validation
  - Reset token generation
  - Email sending via mailer helper
  - Security measures (no user enumeration)

### Reset Password API
- **Location**: `src/app/api/users/resetpassword/route.ts`
- **Purpose**: Validates reset tokens and updates user passwords
- **Key Functions**:
  - Token validation and expiration check
  - Password complexity validation
  - Password hashing
  - Database update with new password
  - Token cleanup

## Database Models

### User Model
- **Location**: `src/models/userModels.js`
- **Purpose**: Defines the user schema and database operations
- **Key Fields**:
  - `forgetPasswordToken`: Stores hashed reset token
  - `forgetPasswordExpiry`: Token expiration timestamp
- **Key Methods**:
  - `comparePassword`: For password verification
  - `updatePassword`: For password updates

## Helper Functions

### Mailer
- **Location**: `src/helpers/mailer.ts`
- **Purpose**: Handles all email sending functionality
- **Key Functions**:
  - Token generation and hashing
  - User document updates with tokens
  - Email content generation
  - Integration with Resend email service

## Configuration

### Database Configuration
- **Location**: `src/dbconfig/dbconfig.ts`
- **Purpose**: Establishes connection to MongoDB database
- **Key Functions**:
  - Database connection setup
  - Connection event handling

## Documentation
- **Location**: `docs/`
- **Purpose**: Explains how the system works
- **Files**:
  - `PASSWORD_RESET_SYSTEM.md`: Comprehensive system documentation
  - `PASSWORD_RESET_FLOW.md`: Visual flow diagram
  - `README.md`: Documentation overview