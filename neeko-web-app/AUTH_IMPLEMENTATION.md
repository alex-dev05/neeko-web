# Authentication Flows and Upload Gating Implementation

This document outlines the authentication system and upload feature gating implemented on the `feat/auth-flows-upload-gating` branch.

## Overview

The application now includes a complete authentication flow with custom email/password authentication and restricts file upload functionality to authenticated users only.

## Features

### 1. Authentication Context (`src/context/AuthContext.tsx`)
- Manages global authentication state
- Persists user session in localStorage
- Provides authentication hooks (`useAuth`)
- Handles login, signup, and logout flows

### 2. Authentication Components

#### Login Component (`src/components/Login.tsx`)
- Email/password login form
- Error handling and display
- Link to switch to signup

#### Signup Component (`src/components/Signup.tsx`)
- Email/password registration form
- Optional name field
- Password confirmation validation
- Minimum 6 character password requirement
- Link to switch to login

### 3. Upload Component (`src/components/Upload.tsx`)
- **Protected behind authentication** - only accessible to logged-in users
- File selection and upload functionality
- User information display (email)
- Logout button
- Upload progress and status feedback
- File size display

### 4. Auth Service (`src/services/authService.ts`)
- Helper functions for managing authentication tokens
- `getAuthToken()` - Retrieve stored auth token
- `setAuthToken(token)` - Store auth token
- `getAuthHeaders()` - Get headers with Bearer token for authenticated requests
- `authenticatedFetch()` - Wrapper for API calls with automatic token inclusion

## Expected Backend API Endpoints

### 1. Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}

Response (400/401):
{
  "message": "Invalid email or password"
}
```

### 2. Signup Endpoint
```
POST /api/auth/signup
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response (200):
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}

Response (400):
{
  "message": "Email already exists"
}
```

### 3. Upload Endpoint
```
POST /api/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Request:
- Form data with "file" field containing the file to upload

Response (200):
{
  "message": "File uploaded successfully",
  "fileId": "file123",
  "fileName": "document.pdf"
}

Response (401):
{
  "message": "Unauthorized"
}

Response (413):
{
  "message": "File too large"
}
```

## Authentication Flow

1. **Initial Load**: App checks localStorage for stored user and token
2. **Not Authenticated**:
   - User sees Login page by default
   - Can switch to Signup to create new account
3. **After Login/Signup**:
   - Token stored in localStorage
   - User data stored in localStorage
   - User redirected to Upload component
4. **Logout**:
   - Clears localStorage
   - Returns to Login page
5. **Session Expiry**:
   - If API returns 401, user is logged out automatically
   - Error message displayed to user

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx           # Auth state management
├── components/
│   ├── Login.tsx                 # Login form
│   ├── Signup.tsx                # Signup form
│   ├── Upload.tsx                # Upload component (protected)
│   ├── Auth.css                  # Auth component styles
│   └── Upload.css                # Upload component styles
├── services/
│   └── authService.ts            # Auth utilities
├── App.tsx                        # Main app with routing logic
└── main.tsx                       # App entry point with AuthProvider
```

## Usage

### Integrating with Backend

1. Update API endpoints in `AuthContext.tsx` (currently `/api/auth/login` and `/api/auth/signup`)
2. Implement the three backend endpoints as specified above
3. The frontend will automatically:
   - Store JWT tokens
   - Include tokens in authorized requests
   - Handle 401 errors by logging out users

### Development

- No additional dependencies required beyond React 19.2.4 and React DOM 19.2.4
- Uses native Fetch API for HTTP requests
- All styling done with CSS (no CSS-in-JS or external UI library)

## Security Considerations

- **CORS**: Configure backend CORS to accept requests from frontend domain
- **Token Storage**: Currently using localStorage (consider upgrading to secure HTTP-only cookies for production)
- **HTTPS**: Use HTTPS in production
- **Token Expiration**: Implement token refresh mechanism if tokens expire
- **Password Validation**: Backend should enforce strong password requirements
- **CSRF Protection**: If using cookies, implement CSRF tokens

## Testing

### Manual Testing Checklist
- [ ] Signup with new email creates account
- [ ] Login with correct credentials logs user in
- [ ] Login with incorrect credentials shows error
- [ ] User data persists on page refresh
- [ ] Logout clears session
- [ ] File upload requires authentication
- [ ] Upload shows success/error messages
- [ ] Session timeout redirects to login

## Future Enhancements

- Password reset functionality
- Email verification
- OAuth/social login integration
- Two-factor authentication
- Session timeout handling with token refresh
- Better error messages and user feedback
- Loading states and spinners
- Rate limiting for login attempts
