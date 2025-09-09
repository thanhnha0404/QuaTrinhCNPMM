@echo off
echo ========================================
echo    KHỞI ĐỘNG TOÀN BỘ DỰ ÁN
echo ========================================
echo.

echo Mở 2 terminal mới để chạy Backend và Frontend...
echo.

echo [1] Mở terminal cho Backend...
start "Backend Server" cmd /k "cd ExpressJS01 && start-project.bat"

echo [2] Mở terminal cho Frontend...
start "Frontend Server" cmd /k "cd ReactJS01 && start-frontend.bat"

echo.
echo ✅ Đã mở 2 terminal
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Nhấn phím bất kỳ để đóng script này...
pause > nul
