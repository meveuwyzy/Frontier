@echo off
setlocal enabledelayedexpansion

:: ---------- ЛОГИН ----------
echo ===== Авторизация =====
for /f "tokens=*" %%i in ('curl -s -X POST http://localhost:8088/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"') do set RESPONSE=%%i
echo %RESPONSE%

:: Получаем токен из JSON (наивно, через findstr)
for /f "tokens=2 delims=:" %%a in ('echo %RESPONSE% ^| findstr "token"') do (
    set TOKEN=%%a
)
:: Убираем кавычки и запятые
set TOKEN=!TOKEN:"=!
set TOKEN=!TOKEN:,=!
echo Token: !TOKEN!

:: ---------- DASHBOARD ----------
echo.
echo ===== Dashboard =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/dashboard
echo.

:: ---------- LOGS ----------
echo ===== Logs =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/dashboard/logs
echo.

:: ---------- RS232 SETTINGS ----------
echo ===== RS232 GET =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/settings/rs232
echo.

echo ===== RS232 POST =====
curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer !TOKEN!" ^
-d "{\"baud_rate\":115200,\"data_bits\":8,\"stop_bits\":1,\"parity\":\"none\",\"flow_control\":\"none\"}" ^
http://localhost:8088/api/settings/rs232
echo.

:: ---------- Gateway GET/POST ----------
echo ===== Gateway GET =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/settings/gateway
echo.

echo ===== Gateway POST =====
curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer !TOKEN!" ^
-d "{\"mode\":\"tcp_server\",\"local_port\":502,\"status\":\"running\",\"expiresIn\":900}" ^
http://localhost:8088/api/settings/gateway/set
echo.

:: ---------- Network GET/POST ----------
echo ===== Network GET =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/settings/network
echo.

echo ===== Network POST =====
curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer !TOKEN!" ^
-d "{\"ip_mode\":\"static\",\"ip_address\":\"192.168.1.200\",\"subnet_mask\":\"255.255.255.0\",\"gateway\":\"192.168.1.1\",\"dns_servers\":\"8.8.4.4\"}" ^
http://localhost:8088/api/settings/network/set
echo.

:: ---------- Change Password ----------
echo ===== Change Password =====
curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer !TOKEN!" ^
-d "{\"current_password\":\"admin123\",\"new_password\":\"newpass123\"}" ^
http://localhost:8088/api/system/password
echo.

:: ---------- Reboot ----------
echo ===== Reboot =====
curl -v -X POST -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/system/reboot
echo.

:: ---------- Configs List ----------
echo ===== Config List =====
curl -v -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/system/config/list
echo.

:: ---------- Save Config ----------
echo ===== Save Config =====
curl -v -X POST -H "Authorization: Bearer !TOKEN!" http://localhost:8088/api/system/config/save
echo.

:: ---------- Load Config ----------
echo ===== Load Config =====
curl -v -X POST -H "Content-Type: application/json" -H "Authorization: Bearer !TOKEN!" ^
-d "{\"file\":\"file1_name\"}" ^
http://localhost:8088/api/system/config/load
echo.

pause
