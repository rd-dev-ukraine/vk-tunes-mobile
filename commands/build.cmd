@echo off

cmd /c call nodevars.bat

call node-sass --output-style compressed  %~dp0../styles/app.scss > www/css/app.css
if %errorlevel% neq 0 exit /b %errorlevel%

call tsc -p %~dp0..\
if %errorlevel% neq 0 exit /b %errorlevel%

call cordova build android