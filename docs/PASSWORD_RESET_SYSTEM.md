# Password Reset System Documentation

## Overview
This document explains how the password reset system works in the Next.js authentication application. The system allows users to securely reset their passwords through a token-based email verification process.

## System Architecture

### Components
1. **Frontend Pages**
   - Forgot Password Page (`/forgot-password`) - Allows users to request a password reset
   - Reset Password Page (`/reset-password`) - Allows users to set a new password using a token

2. **Backend API Routes**
   - Forgot Password API (`/api/users/forgotpassword`) - Generates reset token and sends email
   - Reset Password API (`/api/users/resetpassword`) - Validates token and updates password

3. **Database Model**
   - User Model (`userModels.js`) - Stores user information and reset tokens

4. **Helper Functions**
   - Mailer (`mailer.ts`) - Handles email sending with Resend service

## How It Works

### 1. Forgot Password Flow
1. User visits `/forgot-password` and enters their email
2. Frontend sends POST request to `/api/users/forgotpassword`
3. Backend validates email and checks if user exists
4. If user exists, backend generates a secure reset token:
   - Uses bcrypt to hash the user's ID
   - Stores hashed token in user document with expiration (1 hour)
5. Backend sends email with reset link containing the token
6. User receives email with link to reset password

### 2. Reset Password Flow
1. User clicks reset link from email which redirects to `/reset-password?token=XYZ`
2. Frontend validates token exists in URL parameters
3. User enters new password and confirms it
4. Frontend sends POST request to `/api/users/resetpassword` with token and new password
5. Backend validates:
   - Token exists and hasn't expired
   - Password meets requirements (at least 6 characters)
6. Backend hashes new password and updates user document
7. Reset tokens are cleared from user document
8. User receives confirmation and can log in with new password

## Security Features
- Tokens are hashed before storage (prevents token leakage)
- Tokens expire after 1 hour
- Passwords are hashed using bcrypt before storage
- Email existence is not revealed to prevent user enumeration attacks
- Secure password complexity requirements

## File Structure
```
src/
├── app/
│   ├── forgot-password/
│   │   └── page.tsx          # Forgot password frontend form
│   ├── reset-password/
│   │   └── page.tsx          # Reset password frontend form
│   └── api/users/
│       ├── forgotpassword/
│       │   └── route.ts      # Forgot password API endpoint
│       └── resetpassword/
│           └── route.ts      # Reset password API endpoint
├── models/
│   └── userModels.js         # User database model with token fields
├── helpers/
│   └── mailer.ts             # Email sending functionality
└── dbconfig/
    └── dbconfig.ts           # Database connection setup
```