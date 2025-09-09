@echo off
echo ========================================
echo    KHOI DONG DU AN TIM KIEM SAN PHAM
echo ========================================
echo.

echo 1. Khoi dong Backend...
start "Backend" cmd /k "cd ExpressJS01 && npm start"

echo.
echo 2. Cho backend khoi dong (5 giay)...
timeout /t 5 /nobreak >nul

echo.
echo 3. Khoi dong Frontend...
start "Frontend" cmd /k "cd ReactJS01 && npm run dev"

echo.
echo 4. Mo trinh duyet...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ✅ Da khoi dong thanh cong!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔍 Backend: http://localhost:8080
echo.
echo Ban co the:
echo - Vao trang Products de tim kiem
echo - Su dung Fuzzy Search (tim duoc ca khi go sai chinh ta)
echo - Su dung bo loc danh muc, gia, danh gia
echo.
pause

