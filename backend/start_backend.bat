@echo off
cd /d "C:\Users\dell\Documents\New OpenCode Project\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
