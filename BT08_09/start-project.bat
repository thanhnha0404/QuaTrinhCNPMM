@echo off
echo ========================================
echo    KHOI DONG DU AN FULLSTACK
echo ========================================
echo.

echo 1. Khoi dong Backend...
start "Backend Server" cmd /k "cd ExpressJS01 && npm start"

echo.
echo 2. Cho backend khoi dong (10 giay)...
timeout /t 10 /nobreak >nul

echo.
echo 3. Khoi dong Frontend...
start "Frontend Server" cmd /k "cd ReactJS01 && npm run dev"

echo.
echo ✅ Da khoi dong du an!
echo.
echo 🔍 Backend API: http://localhost:8080
echo 🌐 Frontend: http://localhost:5173
echo.
echo 📝 Cac chuc nang:
echo    - Tim kiem san pham (Fuzzy Search)
echo    - Loc theo danh muc, gia, danh gia
echo    - Phan trang
echo    - CRUD san pham
echo.
echo Nhan Enter de dong cua so nay...
pause >nul
