@echo off

call %~dp0build.cmd
if %errorlevel% neq 0 exit /b %errorlevel%

call cordova run android