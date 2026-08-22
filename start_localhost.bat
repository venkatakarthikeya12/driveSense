@echo off
title DriveSense Localhost Web Server
echo Starting DriveSense Localhost Server on http://localhost:8080...
powershell -ExecutionPolicy Bypass -File "%~dp0start_localhost.ps1"
pause
