# Backend Integration Guide

This document explains how the React frontend has been integrated with the Django REST Framework backend.

## Architecture Overview

### API Service Layer (`src/services/`)

The frontend uses a layered API architecture:

1. **apiClient.js** - Axios configuration
   - Base URL: `http://localhost:8000/api`
   - Request interceptor: Automatically adds Bearer token to all authenticated requests
   - Response interceptor: Handles 401 errors and redirects to login

2. **authService.js** - Authentication functions
   - `registerUser()` - POST /api/register/
   - `loginUser()` - POST /api/login/ 
   - `logoutUser()` - Clear localStorage
   - Token management with localStorage

3. **lockerService.js** - Locker operations
   - `fetchLockers()` - GET /api/lockers/
   - `rentLocker(id, duration)` - POST /api/lockers/{id}/rent/
   - `releaseLocker(id)` - POST /api/lockers/{id}/release/

### Authentication Flow

1. **Signup** (`src/pages/SignUp.jsx`)
   - Collects username, email, password
   - Calls `registerUser()` → POST /api/register/
   - On success: Redirects to login page

2. **Login** (`src/pages/Login.jsx`)
   - Collects username, password
   - Calls `loginUser()` → POST /api/login/
   - Response: `{ token, user }`
   - Token stored in localStorage as `authToken`
   - User info stored in localStorage as `user`
   - On success: Redirects to dashboard

3. **Token Management**
   - All API requests automatically include: `Authorization: Bearer {token}`
   - Token persists across page refreshes (localStorage)
   - On 401 response: Token cleared, user redirected to login

### Component Integration

#### AuthContext (`src/context/AuthContext.jsx`)
- Manages global authentication state
- Restored from localStorage on mount
- Provides: `login()`, `logout()`, `signup()`, `isLoggedIn`, `user`, `isLoading`

#### SmartLockerDashboard (`src/pages/SmartLockerDashboard.jsx`)
- Fetches lockers on mount: `fetchLockers()` → GET /api/lockers/
- Refresh button: Calls `fetchLockers()` again
- Rent button: Initiates rental flow
- Calls `rentLocker(id, rentalDuration)` → POST /api/lockers/{id}/rent/
- Timer logic preserved: Counts down locally, syncs with backend
- Error handling: Shows error banner with retry button

#### LockerCard (`src/components/LockerCard.jsx`)
- Displays individual locker status
- "Rent Locker" button → Opens duration modal
- "Release Lock" button → Releases the locker
- Loading states during API calls
- No changes needed - works with updated parent component

## Expected API Response Formats

### Register Response
```json
{
  "id": 1,
  "username": "newuser",
  "email": "user@example.com"
}
```

### Login Response
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "user",
    "email": "user@example.com"
  }
}
```

### Locker List Response
```json
[
  {
    "id": 1,
    "number": 1,
    "status": "Available",
    "owner": null,
    "time_left": 0,
    "rental_duration": 0
  },
  ...
]
```

### Rent Locker Response
```json
{
  "id": 1,
  "number": 1,
  "status": "In Use",
  "owner": "username",
  "time_left": 1800,
  "rental_duration": 1800
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend URL (if needed)
Edit `src/services/apiClient.js` if your backend runs on a different URL:
```javascript
const API_BASE_URL = 'http://your-backend-url:port/api';
```

### 3. Backend Requirements

Your Django backend must:
- Have CORS enabled (e.g., `django-cors-headers`)
- Allow origin: `http://localhost:5173` (or your React URL)
- Support Bearer token authentication

Example Django CORS settings:
```python
INSTALLED_APPS = [
    'corsheaders',
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

### 4. Start Development Servers

Terminal 1 - Django Backend:
```bash
python manage.py runserver 8000
```

Terminal 2 - React Frontend:
```bash
npm run dev
```

## Features Preserved

✓ All previous UI structure maintained
✓ All component structure preserved
✓ Timer logic synchronized with backend data
✓ Responsive design intact
✓ Notification system working
✓ Loading and error states added
✓ Clean, modular code maintained
✓ Lab requirements preserved

## New Features Added

✓ Real API integration for all operations
✓ Automatic token management
✓ Bearer token in request headers
✓ Error handling with user feedback
✓ Auto-redirect on unauthorized (401)
✓ Session persistence with localStorage
✓ Loading states in forms
✓ Error banners in dashboard
✓ Retry functionality

## Troubleshooting

### "Failed to fetch lockers" Error
- Ensure Django backend is running on http://localhost:8000
- Check CORS is enabled in Django
- Check Authorization header is being sent (open DevTools Network tab)

### "Login failed" Error
- Verify username and password are correct
- Check backend /api/login/ endpoint response format
- Look for errors in Django server console

### Token Not Persisting
- Check browser localStorage (DevTools > Application > Storage > localStorage)
- Should have `authToken` and `user` keys
- Clear localStorage and login again if corrupted

### 401 Unauthorized After Login
- Token might have expired
- Logout and login again
- Check token format in localStorage (should start with "Bearer " or just be the token string)

## File Changes Summary

### New Files
- `src/services/apiClient.js` - Axios configuration
- `src/services/authService.js` - Auth API functions
- `src/services/lockerService.js` - Locker API functions

### Modified Files
- `package.json` - Added axios dependency
- `src/context/AuthContext.jsx` - Backend API integration
- `src/pages/Login.jsx` - Async login, loading states
- `src/pages/SignUp.jsx` - Async signup, loading states
- `src/pages/SmartLockerDashboard.jsx` - API locker fetching, error handling

### Unchanged Files
- All component files
- All CSS files
- All utility files
- `src/data/mockData.js` - Still available for reference/fallback

## Notes

- Mock data in `src/data/mockData.js` is no longer used but kept for reference
- Timer countdown is handled locally for better UX
- Backend should manage actual locker rental logic and expiration
- All API calls use consistent error handling pattern
- Notifications integrated with all API operations
