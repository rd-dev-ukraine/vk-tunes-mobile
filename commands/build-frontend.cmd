@echo off

cmd /c call nodevars.bat

call node-sass %~dp0../styles/app.scss > www/css/app.css
if %errorlevel% neq 0 exit /b %errorlevel%
echo SASS built

call tsc -p %~dp0..\
if %errorlevel% neq 0 exit /b %errorlevel%
echo Typescript built