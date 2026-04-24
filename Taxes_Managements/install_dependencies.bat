@echo off
setlocal

echo ============================================
echo   INSTALLATION DES DEPENDANCES TAXE APP
echo ============================================

:: 1. Backend Setup
echo [1/2] Configuration du Backend...
cd Backend
if not exist venv (
    echo [INFO] Creation de l'environnement virtuel Python...
    python -m venv venv
)
echo [INFO] Installation des requirements Python...
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

:: 2. Frontend Setup
echo [2/2] Configuration du Frontend...
cd FrontEnds
echo [INFO] Installation des packages Node.js...
call npm install
cd ..

echo ============================================
echo   INSTALLATION TERMINEE AVEC SUCCES !
echo ============================================
echo Pour lancer le projet :
echo 1. Lancez start_backend.bat
echo 2. Lancez start_frontend.bat
pause
