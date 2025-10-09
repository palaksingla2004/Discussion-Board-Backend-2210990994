# Fix White Screen Issue

## Quick Fix Steps

### Step 1: Close All Terminals
Close any open terminal windows running the servers.

### Step 2: Run the Start Script
Double-click: **START_EVERYTHING.bat**

This will:
1. Seed the database
2. Start backend server
3. Start frontend server

### Step 3: Wait and Open Browser
1. Wait 10 seconds for servers to start
2. Open: http://localhost:3000
3. Hard refresh: Press `Ctrl + Shift + R`

---

## Manual Fix (If Script Doesn't Work)

### Terminal 1 - Backend:
```bash
npm run dev
```
Wait until you see: "Server running on port 5000"

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Wait until you see: "Local: http://localhost:3000/"

### Terminal 3 - Seed Database:
```bash
node utils/seedData.js
```

---

## Common Issues & Solutions

### Issue 1: White Screen
**Cause:** Frontend not connecting to backend

**Solution:**
1. Check backend is running: http://localhost:5000/api/health
2. Should see: `{"status":"OK","timestamp":"..."}`
3. If not, restart backend

### Issue 2: "Cannot GET /"
**Cause:** Frontend server not running

**Solution:**
```bash
cd frontend
npm run dev
```

### Issue 3: MongoDB Connection Error
**Cause:** MongoDB not running

**Solution:**
```bash
# Start MongoDB
mongod

# Or start MongoDB service
net start MongoDB
```

### Issue 4: Port Already in Use
**Cause:** Server already running

**Solution:**
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue 5: Dependencies Missing
**Cause:** node_modules not installed

**Solution:**
```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

---

## Browser Console Errors

### Open Browser Console (F12)

**If you see:**
- "Failed to fetch" → Backend not running
- "404 Not Found" → Wrong URL or route
- "CORS error" → Backend CORS issue
- "Unexpected token" → JavaScript syntax error
- Nothing → Check if page is loading at all

---

## Step-by-Step Debugging

### 1. Check Backend
```bash
# Test backend health
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"..."}
```

### 2. Check Frontend
```bash
# Open test page
http://localhost:3000/test.html

# Should show: "Frontend Test" and backend status
```

### 3. Check Database
```bash
# Connect to MongoDB
mongosh

# Check database
use forum_db
db.users.find()
db.categories.find()
```

### 4. Check Browser
1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors (red text)
5. Go to Network tab
6. Refresh page
7. Check if API calls are failing

---

## Complete Reset

If nothing works, do a complete reset:

### 1. Stop Everything
- Close all terminal windows
- Close browser

### 2. Clean Install
```bash
# Backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
cd ..
```

### 3. Seed Database
```bash
node utils/seedData.js
```

### 4. Start Fresh
```bash
# Terminal 1
npm run dev

# Terminal 2
cd frontend
npm run dev
```

### 5. Open Browser
- Go to: http://localhost:3000
- Hard refresh: Ctrl + Shift + R
- Clear cache if needed

---

## Verification Checklist

- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Backend health check works: http://localhost:5000/api/health
- [ ] Frontend starts without errors
- [ ] Frontend shows Vite dev server message
- [ ] Browser opens http://localhost:3000
- [ ] No errors in browser console (F12)
- [ ] Page loads (not white screen)
- [ ] Can see "Forum" or "Discussion Forum" text
- [ ] Can click Login button

---

## Expected Output

### Backend Terminal:
```
Connected to MongoDB
Database: forum_db
Server running on port 5000
Health check: http://localhost:5000/api/health
```

### Frontend Terminal:
```
VITE v4.5.14  ready in 1776 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### Browser:
- Should see: Forum homepage
- Navbar with: Home, Login, Register
- Search bar
- Category dropdown
- Thread list (or "No threads found")

---

## Still Not Working?

### Check These:

1. **Node.js Version**
   ```bash
   node --version
   # Should be v16 or higher
   ```

2. **MongoDB Running**
   ```bash
   mongosh
   # Should connect without error
   ```

3. **Ports Available**
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :5000
   # Should be empty or show your servers
   ```

4. **Firewall**
   - Allow Node.js through firewall
   - Allow MongoDB through firewall

5. **Antivirus**
   - Temporarily disable to test
   - Add project folder to exclusions

---

## Emergency Contact

If still having issues:

1. Take screenshot of:
   - Backend terminal
   - Frontend terminal
   - Browser console (F12)
   - Browser network tab (F12)

2. Check:
   - What error messages you see
   - What step fails
   - What you've tried

3. Common fixes:
   - Restart computer
   - Reinstall Node.js
   - Reinstall MongoDB
   - Use different browser
   - Disable antivirus temporarily

---

## Success Indicators

You'll know it's working when:
- ✅ Backend terminal shows "Server running"
- ✅ Frontend terminal shows "Local: http://localhost:3000/"
- ✅ Browser shows forum homepage (not white)
- ✅ No red errors in console
- ✅ Can click buttons and navigate

---

**Good luck! The forum should work after following these steps.** 🚀
