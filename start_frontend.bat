@echo off
echo ============================================
echo   DEMARRAGE DU FRONTEND React + Vite
echo ============================================
echo.

set NODE="%~dp0tools\node-v22.11.0-win-x64\node.exe"
set NPM="%~dp0tools\node-v22.11.0-win-x64\npm.cmd"
set FRONTEND_DIR="%~dp0Taxes_Managements\FrontEnds"

cd /d %FRONTEND_DIR%

echo [INFO] Demarrage du serveur de dev sur http://localhost:5173
echo.

%NPM% run dev

pause
