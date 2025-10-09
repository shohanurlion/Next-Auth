# Setup and Usage Guide

This document explains how to set up and use the password reset system in the Next.js authentication application.

## Prerequisites

Before using the password reset system, ensure you have:

1. A MongoDB database connection
2. A Resend API key for email sending
3. Environment variables configured

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
MONGO_URL=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
DOMAIN=http://localhost:3000
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your MongoDB database
3. Obtain a Resend API key from [resend.com](https://resend.com)
4. Configure your environment variables
5. Run the development server:
   ```bash
   npm run dev
   ```

## Usage Flow

### For Users

1. **Request Password Reset**
   - Navigate to `/forgot-password`
   - Enter your email address
   - Submit the form
   - Check your email for a reset link

2. **Reset Password**
   - Click the reset link in your email
   - Enter and confirm your new password
   - Submit the form
   - You'll be redirected to a success page
   - Log in with your new password

### For Developers

#### Understanding the Code Structure

The password reset system consists of:

1. **Frontend Components** (`src/app/`)
   - Forgot password page (`forgot-password/page.tsx`)
   - Reset password page (`reset-password/page.tsx`)

2. **API Routes** (`src/app/api/users/`)
   - Forgot password endpoint (`forgotpassword/route.ts`)
   - Reset password endpoint (`resetpassword/route.ts`)

3. **Database Model** (`src/models/userModels.js`)
   - User schema with token fields
   - Password hashing methods

4. **Helper Functions** (`src/helpers/mailer.ts`)
   - Email sending functionality

#### Key Security Features

1. **Token Hashing**: Tokens are hashed before storage
2. **Token Expiration**: Tokens expire after 1 hour
3. **User Enumeration Prevention**: Same response whether user exists or not
4. **Password Requirements**: Minimum 6 character passwords
5. **Single-Use Tokens**: Tokens are cleared after successful use

## Testing

To test the password reset functionality:

1. Ensure your Resend account is set up for testing
2. Use the email address associated with your Resend account
3. Navigate to `/forgot-password`
4. Enter your email and submit
5. Check your email for the reset link
6. Click the link and set a new password
7. Verify you can log in with the new password

## Troubleshooting

### Common Issues

1. **Emails not being sent**
   - Check that `RESEND_API_KEY` is set correctly
   - Verify you're using the email address associated with your Resend account
   - Check the console for error messages

2. **Invalid token errors**
   - Tokens expire after 1 hour
   - Each token can only be used once
   - Request a new reset link

3. **Password not updating**
   - Ensure the new password meets requirements (minimum 6 characters)
   - Check the console for database errors

### Debugging Tips

1. Check browser console for frontend errors
2. Check terminal output for backend errors
3. Verify environment variables are set correctly
4. Ensure MongoDB is accessible