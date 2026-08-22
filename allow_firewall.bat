@echo off
title DriveSense Firewall Unblocker
echo Allowing incoming TCP connections on Port 8080 for DriveSense...
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-Command New-NetFirewallRule -DisplayName \"DriveSense Server 8080\" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 -ErrorAction SilentlyContinue'"
echo.
echo Firewall rule added successfully!
echo You can now connect your mobile phone to http://192.168.1.20:8080
pause
