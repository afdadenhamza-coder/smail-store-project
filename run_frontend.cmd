@echo off
cd /d "C:\Users\dell\Documents\New OpenCode Project\frontend"
echo Starting Next.js dev server...
call npm run dev
echo Exit code: %ERRORLEVEL%
pause
