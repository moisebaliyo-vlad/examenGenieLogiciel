@echo off
echo ============================================
echo   DEMARRAGE DU BACKEND FastAPI (Python)
echo ============================================
echo.

set PYTHON="%~dp0tools\python\python.exe"
set BACKEND_DIR="%~dp0Taxes_Managements\Backend"

cd /d %BACKEND_DIR%

echo [INFO] Demarrage du serveur FastAPI sur http://localhost:8000
echo [INFO] Documentation API : http://localhost:8000/docs
echo.

%PYTHON% -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
