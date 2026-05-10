# SMART LOCKER SYSTEM - QUICK START GUIDE

## Installation & Setup

```bash
# Navigate to project
cd c:\Users\Avenido\locker

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Access the Application

- **Dev Server:** http://localhost:5174
- **Production Build:** npm run preview

## Test Accounts

### Option 1: Demo Account (Pre-created)
- **Username:** demo
- **Password:** demo1234
- **Email:** demo@example.com

### Option 2: Create New Account
1. Click "Sign Up" link
2. Enter username (min 3 chars)
3. Enter email (must include @)
4. Enter password (min 4 chars)
5. Confirm password (must match)
6. Click "Create Account"
7. Redirected to login automatically

## Complete User Flow

### Step 1: Login
1. Open http://localhost:5174
2. Enter demo credentials or signup
3. Click "Sign In" or "Create Account"

### Step 2: Dashboard
- You'll see 8 available lockers
- Statistics show: Total (8), Available (8), In Use (0)
- All lockers display "Available" status

### Step 3: Rent a Locker
1. Click "Rent Locker" button on any locker
2. Modal opens: "Select Rental Duration"
3. Choose one of three options:
   - 30 minutes
   - 1 hour
   - 2 hours
4. Click "Confirm Duration"

### Step 4: Monitor Rental
1. Locker status changes to "In Use"
2. Rented by shows your username
3. Timer displays countdown (MM:SS format)
4. Timer updates every 1 second
5. Statistics update: Available decreases, In Use increases

### Step 5: Warning Alert (5 Minutes)
- When timer reaches 5 minutes (300 seconds)
- Timer text changes color (red)
- Timer background changes (light red)
- Timer pulses with animation
- Notification: "⏰ Warning: Locker #X has 5 minutes remaining!"

### Step 6: Timer Expires
- When timer reaches 0 seconds
- Locker automatically resets to "Available"
- Timer disappears
- "Rented by" field disappears
- Notification: "✓ Locker #X rental time has ended"
- Statistics update

### Step 7: Manual Release (Optional)
- Instead of waiting for timer
- Click "Release Lock" button
- Locker becomes "Available" immediately
- Notification: "🔒 Locker #X has been released"
- You can rent same locker again

### Step 8: Logout
- Click "Logout" button in navbar
- Returns to login page
- Session saved in sessionStorage
- Can refresh page and still see previous session

## Feature Testing

### Test Multiple Rentals
1. Login to dashboard
2. Rent locker #1 for 30 minutes
3. Rent locker #2 for 1 hour
4. Rent locker #3 for 2 hours
5. Watch multiple timers count down
6. See statistics update

### Test Timer Precision
1. Select "30 minutes" (1800 seconds)
2. Timer counts: 30:00 → 29:59 → ... → 00:01 → 00:00
3. Approximately 30 minutes of real time

### Test Responsive Design
1. Desktop (1920px): 3-4 lockers per row
2. Tablet (768px): 1 locker per row, stacked stats
3. Mobile (480px): Single column, all elements stack

### Test Notifications
- Open browser DevTools console
- Notifications log every action
- Types: info, success, warning, alert
- Sources: auth, locker, system

### Test Local Persistence
1. Login to dashboard
2. Refresh browser (F5)
3. Still logged in (session restored)
4. All locker states preserved

## Troubleshooting

### Port Already in Use
- Dev server tries port 5173, then 5174, then 5175
- If you see "trying another one..." - it's normal
- Current server running on different port shown in output

### Build Errors
- Ensure Node.js 16+ installed
- Delete `node_modules` folder
- Run `npm install` again
- Run `npm run build`

### Hot Reload Not Working
- Save file again (sometimes needs double save)
- Check browser console for errors
- Restart dev server: `Ctrl+C` then `npm run dev`

### State Not Persisting
- Check browser allows sessionStorage
- Clear browser cache/cookies if needed
- Try incognito mode for fresh session

## File Structure

```
locker/
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx (updated)
│   │   ├── LockerCard.jsx (updated)
│   │   ├── NotificationListener.jsx
│   │   ├── RentalDurationModal.jsx (new)
│   │   └── TimerDisplay.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── data/
│   │   └── mockData.js (updated)
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── SmartLockerDashboard.jsx (updated)
│   ├── styles/
│   │   └── dashboard.css (updated)
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
├── eslint.config.js
├── REFACTORING_SUMMARY.md (new)
├── IMPLEMENTATION_CHECKLIST.md (new)
└── CHANGES_LOG.md (new)
```

## Performance Notes

- **LockerCard** memoized with React.memo for optimization
- **Timer** uses efficient setInterval with 1-second updates
- **Grid Layout** uses CSS Grid for responsive 3-column display
- **Modal** uses CSS for smooth animations
- **Notifications** limited to last 50 messages

## Next Steps (When Ready for Backend)

1. Create `src/services/api.js` for API calls
2. Add API endpoints
3. Replace mock data with API calls
4. Add authentication token handling
5. Update timer to use WebSocket
6. Add loading states and error handling
7. No component changes needed!

---

**Status:** ✅ Ready for Presentation & Testing

**Last Build:** Successful (no errors)
**Dev Server:** Running
**All Tests:** Passing
