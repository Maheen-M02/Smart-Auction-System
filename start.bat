@echo off
echo Starting KYC Verification System...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo System Started!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Close the command windows to stop the services
