@echo off
echo ========================================
echo    KHỞI ĐỘNG DỰ ÁN FULLSTACK NODEJS
echo ========================================
echo.

echo [1/4] Cài đặt dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi cài đặt dependencies
    pause
    exit /b 1
)
echo ✅ Cài đặt dependencies thành công
echo.

echo [2/4] Tạo dữ liệu mẫu...
call npm run seed
if %errorlevel% neq 0 (
    echo ⚠️ Không thể tạo dữ liệu mẫu (có thể MongoDB chưa chạy)
)
echo.

echo [3/4] Khởi động Backend Server...
echo Backend sẽ chạy tại: http://localhost:8080
echo API endpoints:
echo   - GET  /v1/api/products/fuzzy-search
echo   - GET  /v1/api/products/filter
echo   - GET  /v1/api/products/suggestions
echo   - GET  /v1/api/products/filter-options
echo.
echo Nhấn Ctrl+C để dừng server
echo.

call npm run dev
