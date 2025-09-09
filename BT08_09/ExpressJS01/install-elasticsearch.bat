@echo off
echo Installing Elasticsearch...

REM Tạo thư mục elasticsearch
if not exist "elasticsearch" mkdir elasticsearch
cd elasticsearch

REM Tải Elasticsearch (Windows)
echo Downloading Elasticsearch...
powershell -Command "Invoke-WebRequest -Uri 'https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.11.0-windows-x86_64.zip' -OutFile 'elasticsearch.zip'"

REM Giải nén
echo Extracting Elasticsearch...
powershell -Command "Expand-Archive -Path 'elasticsearch.zip' -DestinationPath '.' -Force"

REM Di chuyển vào thư mục elasticsearch
cd elasticsearch-8.11.0

REM Tạo file cấu hình
echo Creating configuration...
echo # Cluster name
echo cluster.name: my-application
echo.
echo # Node name
echo node.name: node-1
echo.
echo # Network settings
echo network.host: localhost
echo http.port: 9200
echo.
echo # Discovery settings
echo discovery.type: single-node
echo.
echo # Security settings (disable for development)
echo xpack.security.enabled: false
echo xpack.security.enrollment.enabled: false
echo.
echo # Memory settings
echo bootstrap.memory_lock: false
echo.
echo # Logging
echo logger.level: INFO
) > config/elasticsearch.yml

echo.
echo Elasticsearch installed successfully!
echo.
echo To start Elasticsearch, run:
echo   cd elasticsearch\elasticsearch-8.11.0
echo   bin\elasticsearch.bat
echo.
echo Then in another terminal, run:
echo   npm run dev
echo.
pause
