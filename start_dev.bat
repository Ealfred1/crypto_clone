@echo off
REM DexVault Campaign System Development Startup Script (Windows)
REM Backend is running remotely on ngrok

echo 🚀 Starting DexVault Campaign System Frontend
echo =============================================
echo ✅ Backend is already running remotely at: https://2ebb6db71568.ngrok-free.app
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend" (
    echo ❌ Required directory 'frontend' not found
    echo    Make sure you're running this script from the project root
    pause
    exit /b 1
)

echo 📋 Prerequisites check passed
echo.

REM Check backend connectivity
echo 🔍 Checking backend connectivity...
curl -s https://2ebb6db71568.ngrok-free.app/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Warning: Backend may not be accessible
    echo    Check: https://2ebb6db71568.ngrok-free.app/api/health
) else (
    echo ✅ Backend is accessible and responding
)
echo.

REM Start Frontend
echo 🎨 Starting Frontend Server...
cd frontend
start "Frontend Server" python serve.py
cd ..

REM Wait a moment for frontend to start
timeout /t 2 /nobreak >nul

echo ✅ Frontend server started!
echo.
echo 🌐 Your application is now available at:
echo    Frontend: http://localhost:3000
echo    Backend API: https://2ebb6db71568.ngrok-free.app
echo    API Docs: https://2ebb6db71568.ngrok-free.app/docs
echo    Health Check: https://2ebb6db71568.ngrok-free.app/api/health
echo.
echo 📱 To test a campaign, navigate to:
echo    http://localhost:3000/#/coin/5LKmh8SLt4FkbddUhLHWP1ufsvdcBAovkH1Gyaw5pump
echo.
echo ⚠️  Note: Close the command prompt window to stop the frontend server
echo.
pause
