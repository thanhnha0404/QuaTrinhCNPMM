@echo off
echo ========================================
echo    KHỞI ĐỘNG FRONTEND REACT
echo ========================================
echo.

echo [1/2] Cài đặt dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi cài đặt dependencies
    pause
    exit /b 1
)
echo ✅ Cài đặt dependencies thành công
echo.

echo [2/2] Khởi động Frontend...
echo Frontend sẽ chạy tại: http://localhost:3000
echo.
echo Nhấn Ctrl+C để dừng server
echo.

call npm run dev
