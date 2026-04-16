@echo off
echo ========================================
echo    BidBazaar - Unified System Startup
echo ========================================
echo.
echo Starting Backend and Frontend...
echo.

REM Start Backend
echo [1/2] Starting Backend (Port 5000)...
start "BidBazaar Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend (Port 3000)...
start "BidBazaar Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    Services Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait a few seconds, then open:
echo http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
