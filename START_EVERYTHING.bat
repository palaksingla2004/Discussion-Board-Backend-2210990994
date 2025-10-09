@echo off
echo ========================================
echo Starting Forum Application
echo ========================================
echo.

echo [1/3] Checking MongoDB...
echo Make sure MongoDB is running!
echo.

echo [2/3] Seeding database...
node utils/seedData.js
echo.

echo [3/3] Starting servers...
echo.
echo Starting BACKEND on http://localhost:5000
start "Backend Server" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

echo Starting FRONTEND on http://localhost:3000
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login with:
echo Email: admin@forum.com
echo Password: Admin123!
echo.
echo Press any key to exit this window...
pause > nul
