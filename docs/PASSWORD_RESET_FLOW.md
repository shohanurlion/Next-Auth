# Password Reset Flow Diagram

```mermaid
graph TD
    A[User clicks "Forgot Password"] --> B[Navigate to /forgot-password]
    B --> C[User enters email address]
    C --> D[Submit form to /api/users/forgotpassword]
    D --> E{User exists?}
    E -->|Yes| F[Generate secure reset token]
    E -->|No| G[Return success message anyway]
    F --> H[Hash token and store in DB]
    H --> I[Send email with reset link]
    I --> J[User receives email]
    J --> K[User clicks reset link]
    K --> L[Navigate to /reset-password?token=XYZ]
    L --> M[User enters new password]
    M --> N[Submit to /api/users/resetpassword]
    N --> O{Valid token?}
    O -->|Yes| P[Hash new password]
    O -->|No| Q[Show error message]
    P --> R[Update user password in DB]
    R --> S[Clear reset token fields]
    S --> T[Show success message]
    T --> U[User can now login with new password]
```

## Key Security Features

1. **Token Hashing**: Reset tokens are hashed before storage using bcrypt
2. **Token Expiration**: Tokens expire after 1 hour
3. **User Enumeration Prevention**: Same response whether user exists or not
4. **Password Hashing**: New passwords are hashed before storage
5. **Single Use Tokens**: Tokens are cleared after successful use