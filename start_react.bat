@echo off
echo Starting React frontend...
cd /d "%~dp0\frontend"
start cmd /k "npm start"
