@echo off
set PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%
echo Starting AMS Backend on http://localhost:5000 ...
call pnpm.cmd run dev
