@echo off
rem Add Node.js to PATH for this session
set "PATH=C:\Program Files\nodejs;%PATH%"
@rem Add Node.js folder to PATH (using provided directory)
set "NODE_DIR=C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Node.js"
set "PATH=%NODE_DIR%;%PATH%"
rem Verify Node is available
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found in PATH. Please install Node.js first.
  exit /b 1
)
rem Verify npm is available
where npm >nul 2>&1
if errorlevel 1 (
  echo npm not found in PATH. Please ensure npm is installed with Node.js.
  exit /b 1
)

rem Verify Node and npm are reachable
node -v
npm -v

rem Install Vercel CLI globally
npm install -g vercel

rem Show installed Vercel version
vercel --version

rem Authenticate (will read VERCEL_TOKEN from environment or .env)
vercel whoami
