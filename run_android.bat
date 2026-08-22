@echo off
echo ===================================================
echo   DriveSense Android Deployment & Launcher
echo ===================================================
echo.

echo [1/3] Building Web App assets...
call npx cap copy android

echo [2/3] Syncing Capacitor Android Native Container...
call npx cap sync android

echo [3/3] Launching DriveSense in Android Studio / Device...
call npx cap open android

echo.
echo ===================================================
echo  Android Studio opening project at:
echo  %CD%\android
echo ===================================================
pause
