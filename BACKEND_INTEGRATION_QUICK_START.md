# Backend API Integration - Quick Start & Verification

## Prerequisites
- Django backend running at: `http://127.0.0.1:8000/api/`
- Backend endpoints implemented:
  - POST `/register/`
  - POST `/login/`
  - GET `/lockers/`
  - POST `/lockers/{id}/rent/`

## Running the Application

### Step 1: Start Django Backend
```bash
cd your-django-project
python manage.py runserver
# Backend will run at http://127.0.0.1:8000/
```

### Step 2: Start React Web UI
```bash
cd locker
npm run dev
# Web UI will run at http://localhost:5173/
```

---

## Verification Steps

### ✅ Test 1: User Registration
1. Open Web UI at `http://localhost:5173/`
2. Click "Sign Up"
3. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test1234`
   - Confirm Password: `test1234`
4. Click "Sign Up"
5. **Expected:** Success message, redirect to login page
6. **Verify:** Check Django admin → Users table → New user created

---

### ✅ Test 2: User Login
1. On login page, enter:
   - Username: `testuser`
   - Password: `test1234`
2. Click "Sign In"
3. **Expected:** Dashboard loads with lockers
4. **Verify:** 
   - Open DevTools → Application → localStorage
   - Should see: `authToken` (JWT token)
   - Should see: `user` (JSON user data)

---

### ✅ Test 3: Locker Data from API
1. On dashboard, verify lockers display
2. **Expected:** Locker data from `GET /lockers/` API call
3. **Verify:**
   - Open DevTools → Network tab
   - Look for request to `/api/lockers/`
   - Response should contain locker array
   - Each locker has: id, number, status, owner, time_left

---

### ✅ Test 4: Rent Locker (Critical Test)
1. Click "Rent a Locker" button
2. Select a locker from dropdown
3. Select rental duration (e.g., "1 hour")
4. Click "Rent Locker"
5. **Expected:** 
   - Locker status changes to "In Use"
   - Owner name displayed
   - Timer starts countdown
   - Success notification shown
6. **Verify:**
   - DevTools → Network → Look for POST to `/api/lockers/{id}/rent/`
   - Check Django admin → Locker status is "In Use"
   - Check owner is current user

---

### ✅ Test 5: Rent Second Locker (No Logout)
1. Click "Rent a Locker" again
2. Select a different locker
3. Click "Rent Locker"
4. **Expected:**
   - Second locker status changes to "In Use"
   - User remains logged in (no redirect to login)
   - Dashboard still accessible
   - Both lockers show correct status
5. **Verify:** This was the main authentication issue - should be fixed

---

### ✅ Test 6: Page Refresh - Session Persists
1. While logged in on dashboard
2. Press F5 (refresh page)
3. **Expected:**
   - User remains logged in
   - Dashboard loads immediately
   - Locker status preserved
   - No redirect to login
4. **Verify:**
   - DevTools → Application → localStorage
   - authToken and user still present

---

### ✅ Test 7: Django Admin Reflection
1. Keep Web UI open on dashboard
2. Open Django admin in another tab
3. Click "Lockers" → Edit a locker status
4. Change status to different value
5. Save changes
6. Return to Web UI
7. Click "Refresh Status" button
8. **Expected:** Locker shows updated status from Django admin
9. **Verify:** UI reflects changes immediately

---

### ✅ Test 8: Logout
1. On dashboard, click logout button
2. **Expected:** Redirected to login page
3. **Verify:**
   - DevTools → Application → localStorage
   - authToken is cleared
   - user is cleared
   - Cannot access dashboard without logging in again

---

### ✅ Test 9: Authorization Header Check
1. Open DevTools → Network tab
2. Click "Refresh Status" on dashboard
3. Look for request to `/api/lockers/`
4. Click on the request
5. Look at "Request Headers" tab
6. **Expected:** See header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
7. **Verify:** Token is included in every protected request

---

## Backend Connection Summary

### All Data Sources

| Data | Source | Endpoint | Method |
|------|--------|----------|--------|
| User ID, Username, Email | Backend Database | POST `/login/` | POST |
| Auth Token | Backend | POST `/login/` | POST |
| All Lockers | Backend API | GET `/lockers/` | GET |
| Locker Status | Backend API | GET `/lockers/` | GET |
| Owner Name | Backend API | GET `/lockers/` | GET |
| Time Remaining | Backend API | GET `/lockers/` | GET |
| Rent Confirmation | Backend API | POST `/lockers/{id}/rent/` | POST |

### All Hardcoded Data

| Item | Status | Notes |
|------|--------|-------|
| Mock Users | ❌ REMOVED | No users from mockData.js |
| Mock Lockers | ⚠️ FALLBACK ONLY | Used only when backend unavailable |
| Rental Durations | ✅ CONFIGURATION | Static options (30min, 1h, 2h) |
| UI Constants | ✅ CONFIGURATION | Button labels, styles, messages |

---

## Troubleshooting

### Issue: Blank Dashboard After Login
**Cause:** Backend `/lockers/` endpoint not working
**Solution:**
1. Check backend console for errors
2. Verify Django app has lockers in database
3. Test endpoint: `curl http://127.0.0.1:8000/api/lockers/`

### Issue: CORS Error in Browser
**Cause:** Backend doesn't allow requests from http://localhost:5173
**Solution:** Update Django settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### Issue: 401 Unauthorized on API calls
**Cause:** Token not being sent or token expired
**Solution:**
1. Check localStorage for authToken
2. Try logging in again
3. Check if backend token is valid

### Issue: Changes in Django Admin not reflecting
**Cause:** Page not refreshing locker data
**Solution:**
1. Click "Refresh Status" button on dashboard
2. Or manually press F5 to refresh page
3. Next API call will fetch fresh data

---

## API Response Format Verification

### Login Response Should Include
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Lockers Response Should Include
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
    "owner": "testuser",
    "time_left": 1800
  }
]
```

### Rent Locker Response Should Include
```json
{
  "id": 1,
  "number": 1,
  "status": "In Use",
  "owner": "testuser",
  "time_left": 3600,
  "rental_duration": 3600
}
```

---

## Browser DevTools Inspection

### To Verify Token Storage
1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "Local Storage"
4. Click on `http://localhost:5173`
5. Look for keys:
   - `authToken` - JWT token
   - `user` - User data JSON

### To Verify API Requests
1. Open DevTools (F12)
2. Go to "Network" tab
3. Perform an action (e.g., "Rent a Locker")
4. Look for requests to:
   - `http://localhost:8000/api/lockers/`
   - `http://localhost:8000/api/lockers/1/rent/`
5. Click request → "Headers" tab
6. Verify `Authorization: Bearer <token>` is present

---

## Key Files Modified

1. **src/data/mockData.js**
   - Removed mock users
   - Kept fallback mock lockers for error scenarios
   - Kept rental duration configuration

2. **src/services/apiClient.js**
   - Base URL: `http://localhost:8000/api`
   - Authorization header interceptor
   - Error handling with retries
   - 401 handling for token expiration

3. **src/services/authService.js**
   - `registerUser()` → POST `/register/`
   - `loginUser()` → POST `/login/`
   - Token storage/retrieval

4. **src/services/lockerService.js**
   - `fetchLockers()` → GET `/lockers/`
   - `rentLocker()` → POST `/lockers/{id}/rent/`

5. **src/context/AuthContext.jsx**
   - Session restoration on app load
   - Token persistence
   - User state management

6. **src/pages/SmartLockerDashboard.jsx**
   - Fetches lockers from API on mount
   - Handles rent/release operations
   - Fallback to mock data on connection errors

---

## Success Indicators

✅ **Your integration is working if:**
- Users can register in web UI and see new user in Django admin
- Users can login and get redirected to dashboard
- Locker list loads from API (not hardcoded)
- Lockers can be rented without logout
- Token is visible in localStorage
- Authorization header is sent with requests
- Django admin changes sync with web UI
- Session persists after page refresh
- No mock users or hardcoded locker data
- Error handling works gracefully

---

## Next Steps

1. Test all verification steps above
2. Monitor browser console for any errors
3. Check Django backend logs for issues
4. Verify database reflects changes
5. Test on different browsers if needed
6. Deploy to production when verified

For detailed technical documentation, see: **BACKEND_API_INTEGRATION.md**
