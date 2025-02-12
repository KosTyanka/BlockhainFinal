@echo off
echo Deploying AITUSE2321 token
cd /d "%~dp0"
npx hardhat run scripts/deployToken.js --network localhost > deploy_log.txt
for /f "tokens=5" %%a in ('findstr /C:"AITUSE2321 deployed to:" deploy_log.txt') do set TOKEN_ADDRESS=%%a

echo Deploying AIModelMarketplace
npx hardhat run scripts/deployMarketplace.js --network localhost > deploy_log.txt
for /f "tokens=5" %%a in ('findstr /C:"Marketplace deployed to:" deploy_log.txt') do set MARKETPLACE_ADDRESS=%%a

echo Updating frontend with new contract address
cd frontend
powershell -Command "(gc src\App.js) -replace 'const tokenAddress = .*;', 'const tokenAddress = \"%TOKEN_ADDRESS%\";' -replace 'const marketplaceAddress = .*;', 'const marketplaceAddress = \"%MARKETPLACE_ADDRESS%\";' | Set-Content src\App.js"

echo Contracts deployed successfully

pause
