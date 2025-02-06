@echo off
echo Starting Hardhat node...
cd /d "%~dp0"
start cmd /k "npx hardhat node"
