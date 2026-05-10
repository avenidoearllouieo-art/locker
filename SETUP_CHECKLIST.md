# Backend Integration - Setup Checklist

## Pre-Integration Steps

- [ ] Ensure Django backend is created and running
- [ ] Django backend should be at http://localhost:8000
- [ ] Django CORS is configured and allows http://localhost:5173

## Post-Integration Setup

### Step 1: Install Dependencies
```bash
npm install
```
This installs axios which is required for API communication.

### Step 2: Verify Backend Configuration
- [ ] Backend base URL is correct in `src/services/apiClient.js`
- [ ] Backend has CORS enabled for React origin
- [ ] Backend API endpoints are ready:
  - [ ] POST /api/register/
  - [ ] POST /api/login/
  - [ ] GET /api/lockers/
  - [ ] POST /api/lockers/{id}/rent/

### Step 3: Start Services

Terminal 1 - Start Django Backend:
```bash
python manage.py runserver
```

Terminal 2 - Start React Development Server:
```bash
npm run dev
```

## Integration Verification

### Authentication Flow Testing
- [ ] Sign up with new user credentials
  - Verify signup form sends data to /api/register/
  - Verify redirect to login page on success
  - Check error display on failure

- [ ] Log in with created user
  - Verify login form sends data to /api/login/
  - Verify token is saved in localStorage
  - Verify redirect to dashboard on success
  - Check error display on failure

### Dashboard Testing
- [ ] Dashboard loads and fetches lockers from API
  - Check Network tab shows GET /api/lockers/ request
  - Verify all lockers are displayed
  - Verify stats count is correct

- [ ] Rent a locker
  - Click "Rent Locker" button
  - Select rental duration
  - Verify POST /api/lockers/{id}/rent/ is called
  - Verify locker status changes to "In Use"
  - Verify timer starts counting down

- [ ] Timer functionality
  - Locker countdown should decrement every second
  - 5-minute warning should trigger notification
  - Timer should reset locker to "Available" when expired

- [ ] Release locker
  - Click "Release Lock" button on in-use locker
  - Verify locker returns to "Available" status

### Error Handling Testing
- [ ] Stop backend and try login
  - Should show error message
  - Error banner should appear with retry option

- [ ] Stop backend and try to fetch lockers
  - Dashboard should show error message
  - Retry button should allow refetch when backend is back

- [ ] Invalid credentials
  - Should show appropriate error message

### Session Persistence Testing
- [ ] Log in and refresh page
  - Should remain logged in
  - Dashboard should load with lockers

- [ ] Log in, close browser, reopen
  - Should remain logged in (localStorage persists)
  - Dashboard should load immediately

## API Response Format Verification

Verify your backend returns data in these formats:

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

### Lockers List Response
```json
[
  {
    "id": 1,
    "number": 1,
    "status": "Available",
    "owner": null,
    "time_left": 0,
    "rental_duration": 0
  }
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

## Browser DevTools Checks

### Check localStorage
1. Open DevTools (F12)
2. Go to Application > Storage > localStorage
3. Should see `authToken` and `user` after login
4. Format: `authToken` is the JWT token string

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, fetch lockers, rent)
4. Verify requests are being sent to correct endpoints
5. Check request headers include `Authorization: Bearer {token}`
6. Verify response format matches expected

### Check Console for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Should have no CORS errors
4. API error messages should be logged

## Troubleshooting Guide

### Issue: CORS Error
**Solution:** 
- Ensure `django-cors-headers` is installed
- Add to INSTALLED_APPS and MIDDLEWARE
- Add React URL to CORS_ALLOWED_ORIGINS

### Issue: "Failed to fetch lockers"
**Solution:**
- Check backend is running on port 8000
- Check base URL in apiClient.js is correct
- Check Django returns proper JSON response

### Issue: Login fails but no error message
**Solution:**
- Check backend response format
- Should return `{ "token": "...", "user": {...} }`
- Check backend logs for errors

### Issue: Token not persisting after refresh
**Solution:**
- Check localStorage in DevTools
- Should have `authToken` key
- If empty, token wasn't saved on login
- Check login response format

## Deployment Notes

When deploying to production:
1. Update API_BASE_URL in apiClient.js to production backend URL
2. Update CORS_ALLOWED_ORIGINS in Django to production frontend URL
3. Ensure both frontend and backend are served over HTTPS
4. Update any hardcoded localhost references

## Support

For issues, check:
1. Browser DevTools Network and Console tabs
2. Django server logs
3. BACKEND_INTEGRATION.md for detailed architecture
4. Verify all files in src/services/ are present
