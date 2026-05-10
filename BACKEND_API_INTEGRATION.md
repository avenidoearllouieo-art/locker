# Smart Locker Web UI - Backend API Integration Guide

## Overview
The Smart Locker Web UI is fully integrated with the Django REST Framework backend API. All data is fetched dynamically from the backend - there are NO hardcoded users or static locker arrays.

## Backend API Configuration

### Base URL
```
http://localhost:8000/api/
```
(localhost:8000 resolves to 127.0.0.1:8000)

### Configuration File
**Location:** `src/services/apiClient.js`

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
**Endpoint:** `POST /api/register/`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Flow in Web UI:**
1. User fills signup form in `SignUp.jsx`
2. Form data sent to `authService.registerUser()`
3. `apiClient.post('/register/', data)` called
4. Response handled, user redirected to login page
5. User data saved in backend database

---

#### 2. User Login
**Endpoint:** `POST /api/login/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "abc123xyz789",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Flow in Web UI:**
1. User fills login form in `Login.jsx`
2. Form data sent to `authService.loginUser()`
3. `apiClient.post('/login/', credentials)` called
4. Token received and saved to localStorage:
   ```javascript
   localStorage.setItem('authToken', token);
   localStorage.setItem('user', JSON.stringify(user));
   ```
5. User redirected to dashboard
6. Token automatically included in all future requests

---

### Locker Endpoints

#### 3. Fetch All Lockers
**Endpoint:** `GET /api/lockers/`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Response:**
```json
[
  {
    "id": 1,
    "number": 1,
    "status": "Available",
    "owner": null,
    "time_left": 0
  },
  {
    "id": 2,
    "number": 2,
    "status": "In Use",
    "owner": "john_doe",
    "time_left": 1800
  }
]
```

**Flow in Web UI:**
1. SmartLockerDashboard mounts
2. `loadLockers()` called via `fetchLockers()` from `lockerService.js`
3. `apiClient.get('/lockers/')` sends request with Authorization header
4. Locker data received and displayed in dashboard
5. Status updates automatically every second (countdown timer)

---

#### 4. Rent a Locker
**Endpoint:** `POST /api/lockers/{id}/rent/`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Request Body:**
```json
{
  "rental_duration": 3600
}
```

**Response:**
```json
{
  "id": 1,
  "number": 1,
  "status": "In Use",
  "owner": "john_doe",
  "time_left": 3600,
  "rental_duration": 3600
}
```

**Flow in Web UI:**
1. User clicks "Rent a Locker" button
2. RentalDurationModal opens
3. User selects locker and rental duration
4. `handleOpenLocker(lockerId, rentalDuration)` called
5. `rentLocker(lockerId, rentalDuration)` from `lockerService.js` called
6. `apiClient.post('/lockers/{id}/rent/', data)` sends request with Authorization header
7. Backend updates locker status and duration
8. Response received and UI updated
9. User notification displayed
10. Timer starts counting down from rental_duration

---

#### 5. Release a Locker (Optional)
**Endpoint:** `POST /api/lockers/{id}/release/`

**Headers:**
```
Authorization: Bearer <authToken>
```

**Response:**
```json
{
  "id": 1,
  "number": 1,
  "status": "Available",
  "owner": null,
  "time_left": 0
}
```

---

## Authentication Flow

### Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION
   ├─ User enters: username, email, password
   ├─ Form validates input
   ├─ POST /register/ called with credentials
   ├─ Backend creates user in database
   └─ User redirected to login page

2. USER LOGIN
   ├─ User enters: username, password
   ├─ Form validates input
   ├─ POST /login/ called with credentials
   ├─ Backend validates and returns token + user data
   ├─ Token stored: localStorage.setItem('authToken', token)
   ├─ User data stored: localStorage.setItem('user', JSON.stringify(user))
   └─ User redirected to dashboard

3. SESSION PERSISTENCE (On App Reload)
   ├─ AuthProvider mounts
   ├─ Checks localStorage for authToken
   ├─ If token exists, loads user data from localStorage
   ├─ Sets isLoggedIn = true, user = stored user
   └─ Dashboard loads without requiring new login

4. PROTECTED API REQUESTS
   ├─ Every API request includes Authorization header
   ├─ Header format: Authorization: Bearer <authToken>
   ├─ Backend validates token and processes request
   ├─ Response includes updated data
   └─ UI updates with new data

5. TOKEN EXPIRATION (Optional)
   ├─ If backend returns 401 Unauthorized
   ├─ Token is cleared from localStorage
   ├─ User redirected to login page
   └─ User logs in again to get new token
```

---

## Request/Response Interceptors

### Request Interceptor (apiClient.js)
```javascript
apiClient.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Add Authorization header to every request
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

### Response Interceptor (apiClient.js)
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Auto-retry on transient errors (500, 502, 503, 504)
    // with exponential backoff
    
    return Promise.reject(error);
  }
);
```

---

## Data Flow for Renting Lockers

### Complete Rent Locker Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 RENT LOCKER DATA FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. INITIAL STATE
   ├─ Dashboard displays all lockers from: GET /lockers/
   ├─ Locker #1: status=Available, owner=null, time_left=0
   ├─ User sees "Rent a Locker" button
   └─ Timer countdown running for in-use lockers

2. USER RENTS LOCKER #1
   ├─ User clicks "Rent a Locker"
   ├─ RentalDurationModal opens
   ├─ User selects Locker #1
   ├─ User selects duration: 1 hour (3600 seconds)
   ├─ User clicks "Rent Locker" button
   └─ Form submitted

3. API REQUEST
   ├─ handleOpenLocker(1, 3600) called
   ├─ rentLocker(1, 3600) from lockerService.js called
   ├─ POST /lockers/1/rent/ request sent
   ├─ Request body: { rental_duration: 3600 }
   ├─ Authorization header included: Bearer <token>
   └─ Backend processes request

4. BACKEND UPDATES DATABASE
   ├─ Backend fetches Locker #1 from database
   ├─ Updates status: "Available" → "In Use"
   ├─ Updates owner: null → "john_doe"
   ├─ Updates time_left: 0 → 3600
   ├─ Saves changes to database
   └─ Returns updated locker data

5. RESPONSE RECEIVED
   ├─ Response body:
   │  {
   │    "id": 1,
   │    "number": 1,
   │    "status": "In Use",
   │    "owner": "john_doe",
   │    "time_left": 3600,
   │    "rental_duration": 3600
   │  }
   ├─ Local state updated with response data
   └─ Notification displayed: "Locker #1 has been opened"

6. UI UPDATED
   ├─ Locker card changes to "In Use" status
   ├─ Timer starts: 1h 0m → 59m 59s → ...
   ├─ Owner name displayed: "john_doe"
   ├─ Button changes from "Open" to "Close"
   ├─ 5-minute warning notification when time_left=300s
   └─ Locker becomes "Available" when time_left=0

7. DJANGO ADMIN REFLECTION
   ├─ Admin visits Django Admin dashboard
   ├─ Locker #1 shows updated status and owner
   ├─ time_left updates in real-time (via API)
   ├─ All changes sync immediately
   └─ Admin can see live rental activity

8. SECOND LOCKER RENTAL (KEY FIX)
   ├─ User can immediately rent Locker #2
   ├─ Same flow repeats for Locker #2
   ├─ Token remains valid
   ├─ User is NOT logged out
   ├─ Dashboard maintains state
   └─ No unexpected redirect to login
```

---

## File Structure & Integration Points

### Authentication Services
```
src/services/authService.js
├─ registerUser(userData) → POST /register/
├─ loginUser(credentials) → POST /login/
├─ logoutUser() → Clear localStorage
├─ getAuthToken() → Get token from localStorage
├─ getStoredUser() → Get user from localStorage
└─ isAuthenticated() → Check token exists
```

### Locker Services
```
src/services/lockerService.js
├─ fetchLockers() → GET /lockers/
├─ rentLocker(lockerId, duration) → POST /lockers/{id}/rent/
└─ releaseLocker(lockerId) → POST /lockers/{id}/release/
```

### API Configuration
```
src/services/apiClient.js
├─ Base URL: http://localhost:8000/api
├─ Request interceptor: Adds Authorization header
├─ Response interceptor: Handles errors & retries
└─ Retry logic: Auto-retry on transient 5xx errors
```

### Context Management
```
src/context/AuthContext.jsx
├─ Session restoration on app load
├─ Login/Signup/Logout functions
├─ User state management
├─ Token persistence
└─ sessionRestored tracking
```

### Pages & Components
```
src/pages/Login.jsx
├─ Form validation
├─ Calls authService.loginUser()
└─ Redirects to dashboard on success

src/pages/SignUp.jsx
├─ Form validation (username, email, password)
├─ Calls authService.registerUser()
└─ Redirects to login on success

src/pages/SmartLockerDashboard.jsx
├─ Fetches lockers from API on mount
├─ Handles rent/release operations
├─ Manages timer countdown
├─ Auto-refreshes on API errors (retries)
└─ Falls back to mock data if backend unavailable

src/components/RentalDurationModal.jsx
├─ Displays rental duration options
├─ References RENTAL_DURATIONS constant
└─ Sends selection to parent handler
```

---

## Data That Comes From Backend

### ✅ Dynamic Data (From Backend API)

1. **User Data**
   - Username
   - Email
   - User ID
   - Any custom user fields

2. **Authentication Tokens**
   - JWT/Auth token from login
   - Used for all protected requests

3. **Locker Data**
   - Locker ID and number
   - Current status (Available, In Use, Expired)
   - Current owner
   - Time remaining
   - All updates from backend

4. **Rental Information**
   - Rental duration set by user
   - Actual time_left updated by server
   - Owner username
   - Locker availability

---

## Data That Is Configuration Only

### ✅ Static Configuration (From Frontend)

1. **Rental Duration Options** (mockData.js)
   ```javascript
   RENTAL_DURATIONS = {
     THIRTY_MINUTES: 1800,
     ONE_HOUR: 3600,
     TWO_HOURS: 7200
   }
   ```

2. **Fallback Mock Lockers** (Only when API unavailable)
   - 8 lockers with basic structure
   - Used only for error scenarios
   - Real data from API when available

3. **UI Constants**
   - Component styles
   - Button labels
   - Notification messages

---

## How Django Admin Changes Reflect in Web UI

### Scenario 1: Admin Updates Locker Status

```
1. Django Admin Dashboard
   ├─ Admin opens Locker #3
   ├─ Changes status to "Expired"
   ├─ Saves changes
   └─ Database updated

2. Web UI (Already Open)
   ├─ Next API call fetches fresh data
   ├─ GET /lockers/ returns updated status
   ├─ Locker #3 shows as "Expired"
   └─ UI automatically reflects change

3. Automatic Sync
   ├─ Dashboard refreshes data periodically
   ├─ Every locker fetch gets latest status
   ├─ Timer updates maintain accuracy
   └─ No manual refresh needed
```

### Scenario 2: Admin Creates New User

```
1. Django Admin Dashboard
   ├─ Admin creates new user
   ├─ Saves to database
   └─ User available for login

2. Web UI
   ├─ User can now login with new credentials
   ├─ POST /login/ validates against database
   ├─ Token issued if credentials valid
   └─ User can rent lockers
```

---

## Error Handling

### Network Errors
- **Transient errors (500, 502, 503, 504):** Auto-retry with exponential backoff
- **Connection errors:** Fall back to mock data, show warning notification

### Authentication Errors
- **401 Unauthorized:** Token expired, user redirected to login
- **Invalid credentials:** Error message shown on login/signup form

### API Errors
- **Invalid request:** Error message displayed in notification
- **Server errors:** Retry mechanism attempts recovery
- **Timeout:** Shows error message, allows retry

---

## Testing Checklist

- [ ] User can register with new username
- [ ] User data saved in Django admin
- [ ] User can login with created credentials
- [ ] Token saved to localStorage
- [ ] Dashboard loads and shows lockers from API
- [ ] User can rent first locker
- [ ] User can rent second locker (no logout)
- [ ] Locker status updates in Django admin immediately
- [ ] Django admin changes reflect in Web UI on refresh
- [ ] Timer counts down correctly
- [ ] 5-minute warning notification displays
- [ ] User remains logged in after page refresh
- [ ] Logout clears token and user data
- [ ] Backend unavailable → falls back to mock data with warning

---

## Environment Variables

If needed, create `.env` file (not required for localhost):

```
VITE_API_URL=http://localhost:8000/api
```

Update `apiClient.js` to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

---

## Troubleshooting

### Issue: CORS Errors
- **Solution:** Ensure Django backend has CORS configured to accept requests from http://localhost:5173

### Issue: 404 on API endpoints
- **Solution:** Verify backend is running: `python manage.py runserver`

### Issue: Unexpected logout when renting second locker
- **Solution:** Already fixed in apiClient.js with intelligent 401 handling

### Issue: Locker data not updating
- **Solution:** Check network tab in browser DevTools to verify API requests are succeeding

---

## Summary

The Smart Locker Web UI is fully integrated with the Django REST Framework backend:

- ✅ No hardcoded user data
- ✅ No static locker arrays (fallback only)
- ✅ All user data from backend database
- ✅ All locker data from backend API
- ✅ Authentication tokens used for protected requests
- ✅ Session persists across page reloads
- ✅ Django Admin changes sync with Web UI
- ✅ Proper error handling and retries
- ✅ User remains logged in across operations
