@echo off
set PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%
echo Starting AMS Frontend on http://localhost:5173 ...
call pnpm.cmd run dev
