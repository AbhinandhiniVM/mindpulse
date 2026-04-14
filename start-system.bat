@echo off
REM Mental Health Tracker + ESP32 Sensor Integration
REM Quick Start Script for Windows

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🔴 ESP32 Mental Health Dashboard                      ║
echo ║              Smart Biometric Tracking System                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Colors
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RESET=[0m"

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%✗ Node.js is not installed%RESET%
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)
echo %GREEN%✓ Node.js found%RESET%

REM Check npm packages
echo.
echo Checking npm dependencies...
if not exist "node_modules" (
    echo %YELLOW%Installing packages...%RESET%
    call npm install
    if errorlevel 1 (
        echo %RED%✗ Failed to install packages%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%✓ Packages installed%RESET%
)

REM Menu
:menu
echo.
echo What would you like to do?
echo.
echo   1) Start Full System (Backend + Frontend)
echo   2) Start Backend Server only
echo   3) Start Serial Syncer only
echo   4) Install Dependencies
echo   5) View Sensor Setup Guide
echo   6) Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto full_system
if "%choice%"=="2" goto backend_only
if "%choice%"=="3" goto syncer_only
if "%choice%"=="4" goto install_deps
if "%choice%"=="5" goto view_guide
if "%choice%"=="6" goto exit_script
goto menu

:full_system
echo.
echo %CYAN%Starting Full System...%RESET%
echo.
echo The following will be started:
echo   • Backend Server (port 3001)
echo   • Frontend React App (port 3000)
echo   • Serial Syncer (for ESP32 data)
echo.
echo 📌 You'll need 3 terminal windows for this setup.
echo.
echo Option A: Let me start them sequentially
echo Option B: Start Backend and Frontend only (you'll start syncer separately)
echo.
set /p full_choice="Enter A or B: "

if /i "%full_choice%"=="A" (
    echo.
    echo Starting Backend...
    echo %YELLOW%tip: Keep this window open%RESET%
    call npm run server
) else if /i "%full_choice%"=="B" (
    echo.
    echo Starting Frontend...
    echo %YELLOW%tip: Backend will start automatically with dev script%RESET%
    call npm run dev
) else (
    goto menu
)
goto menu

:backend_only
echo.
echo %CYAN%Starting Backend Server...%RESET%
echo Port: http://localhost:3001
echo.
call npm run server
goto menu

:syncer_only
echo.
echo %CYAN%Starting Serial Syncer...%RESET%
echo.
set /p com_port="Enter COM port (default COM11): "
if "!com_port!"=="" set "com_port=COM11"

echo.
echo Connecting to: !com_port!
echo Baud Rate: 115200
echo.
echo %YELLOW%Make sure:%RESET%
echo   • ESP32 is connected to COM port
echo   • Backend server is running (http://localhost:3001)
echo   • Serial monitor shows PPG/BPM/SpO2 data
echo.
pause

set "SERIAL_PORT=!com_port!" && node serial-syncer.js
goto menu

:install_deps
echo.
echo %CYAN%Installing Dependencies...%RESET%
echo.
call npm install
echo.
echo %GREEN%✓ Installation complete%RESET%
goto menu

:view_guide
echo.
echo Opening SENSOR_SETUP.md...
start notepad SENSOR_SETUP.md
goto menu

:exit_script
echo.
echo %GREEN%✓ Goodbye!%RESET%
echo.
exit /b 0

REM Error handling
:error
echo.
echo %RED%✗ An error occurred%RESET%
pause
goto menu
