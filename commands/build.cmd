@echo off

call %~dp0build-frontend.cmd
if %errorlevel% neq 0 exit /b %errorlevel%

call cordova build android