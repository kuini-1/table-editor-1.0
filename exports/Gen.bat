@echo off
set SOURCE=Convert.exe

for %%i in (1 2 3 4 5) do (
    copy "%SOURCE%" "Convert_%%i.exe" >nul
)

echo Done.
exit
