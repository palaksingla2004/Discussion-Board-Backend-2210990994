@echo off
echo ========================================
echo Forum Application Setup
echo ========================================
echo.

echo [1/4] Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Seeding database with sample data...
node utils/seedData.js
echo Database seeded successfully!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start backend (in this terminal):
echo    npm run dev
echo.
echo 2. Start frontend (in a new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
echo Sample login credentials:
echo Email: admin@forum.com
echo Password: Admin123!
echo.
pause
