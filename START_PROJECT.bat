@echo off
echo ========================================
echo   DISCUSSION FORUM - QUICK START
echo ========================================
echo.

echo Step 1: Checking if MongoDB is running...
echo (Make sure MongoDB is running on localhost:27017)
echo.

echo Step 2: Seeding database with sample data...
node utils/seedData.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to seed database!
    echo Make sure MongoDB is running.
    pause
    exit /b 1
)
echo.

echo ========================================
echo   DATABASE SEEDED SUCCESSFULLY!
echo ========================================
echo.
echo Sample accounts created:
echo   Email: admin@forum.com
echo   Password: Admin123!
echo.
echo   Email: john@example.com
echo   Password: John123!
echo.

echo ========================================
echo   STARTING SERVERS...
echo ========================================
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login with: admin@forum.com / Admin123!
echo.
echo Close this window when done.
pause
