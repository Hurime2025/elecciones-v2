@echo off
title VotoControl Pro — Dev Server
color 0B

echo.
echo  =====================================================
echo   🗳️  VotoControl Pro — Iniciando servidor de desarrollo
echo  =====================================================
echo.
echo  URL:  http://localhost:3000
echo  Login: epadilla@sucre.gov.co  /  voto2027
echo.

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no encontrado. Instala desde https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  Instalando dependencias por primera vez...
    call npm install
    echo.
)

echo  Abriendo navegador en http://localhost:3000 ...
echo  Presiona Ctrl+C para detener el servidor.
echo.

start "" "http://localhost:3000"
node ./node_modules/vite/bin/vite.js --port 3000

pause
