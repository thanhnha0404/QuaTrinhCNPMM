@echo off
echo Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting server...
npm start



