# 🚀 HOW TO START THE FORUM

## ⚡ FASTEST WAY (Recommended)

1. **Double-click:** `START_EVERYTHING.bat`
2. **Wait 10 seconds**
3. **Open browser:** http://localhost:3000
4. **Login:**
   - Email: `admin@forum.com`
   - Password: `Admin123!`

**Done!** ✅

---

## 📋 MANUAL WAY

### Prerequisites:
- ✅ Node.js installed
- ✅ MongoDB running
- ✅ Dependencies installed

### Step 1: Start MongoDB
```bash
mongod
```
Leave this terminal open.

### Step 2: Seed Database (First Time Only)
```bash
node utils/seedData.js
```

### Step 3: Start Backend
Open new terminal:
```bash
npm run dev
```
Wait for: "Server running on port 5000"

### Step 4: Start Frontend
Open another new terminal:
```bash
cd frontend
npm run dev
```
Wait for: "Local: http://localhost:3000/"

### Step 5: Open Browser
Go to: **http://localhost:3000**

---

## 🐛 TROUBLESHOOTING

### White Screen?
1. Press `F12` in browser
2. Check Console tab for errors
3. Check Network tab
4. Hard refresh: `Ctrl + Shift + R`

### Backend Not Starting?
```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is free
netstat -ano | findstr :5000
```

### Frontend Not Starting?
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Still Not Working?
Read: **FIX_WHITE_SCREEN.md**

---

## ✅ VERIFICATION

### Check Backend:
Open: http://localhost:5000/api/health

Should see:
```json
{"status":"OK","timestamp":"2024-..."}
```

### Check Frontend:
Open: http://localhost:3000

Should see:
- Forum homepage
- Navbar with Login/Register
- Search bar
- Thread list

### Check Database:
```bash
mongosh
use forum_db
db.users.find()
```

Should see sample users.

---

## 📝 SAMPLE LOGIN

After seeding database:

**Admin Account:**
- Email: `admin@forum.com`
- Password: `Admin123!`

**Regular User:**
- Email: `john@example.com`
- Password: `Password123!`

---

## 🎯 WHAT TO TEST

1. ✅ Login
2. ✅ View threads
3. ✅ Create thread
4. ✅ Add reply
5. ✅ Vote on content
6. ✅ View profile
7. ✅ Filter by category
8. ✅ Search threads

---

## 📚 MORE HELP

- **Quick Start:** QUICK_START.md
- **Full Setup:** SETUP.md
- **Fix Issues:** FIX_WHITE_SCREEN.md
- **API Docs:** README.md
- **Project Info:** PROJECT_OVERVIEW.md

---

## 🎉 SUCCESS!

If you see the forum homepage, everything is working!

**Enjoy your forum!** 🚀
