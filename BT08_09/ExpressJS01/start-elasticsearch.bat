@echo off
echo Starting Elasticsearch...

REM Kiểm tra xem Elasticsearch đã được cài đặt chưa
if not exist "elasticsearch\elasticsearch-8.11.0\bin\elasticsearch.bat" (
    echo Elasticsearch not found. Please run install-elasticsearch.bat first.
    pause
    exit /b 1
)

REM Khởi động Elasticsearch
cd elasticsearch\elasticsearch-8.11.0
bin\elasticsearch.bat
