@echo off
echo Starting Full Stack Application...

echo.
echo Starting Backend API...
start "Backend API" cmd /k "cd BE\CleanArchitecture.WebAPI && dotnet run"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd FE && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://localhost:5168
echo Frontend: http://localhost:3001
echo.
pause
