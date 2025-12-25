@echo off
echo ========================================
echo   Starting Noel Christmas 3D Server
echo ========================================
echo.
echo Server will start on: http://localhost:8000
echo Opening browser...
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start Python HTTP server and open browser
start http://localhost:8000/noel_v2.html
python -m http.server 8000

REM If Python 3 is not found, try Python 2
if errorlevel 1 (
    echo.
    echo Python 3 not found, trying Python 2...
    python -m SimpleHTTPServer 8000
)

REM If still fails, show error message
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Python is not installed!
    echo ========================================
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Or use Node.js alternative: run "npx http-server"
    echo.
    pause
)
