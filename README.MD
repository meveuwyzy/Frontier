Изменения в проекте

1. Добавлена ручная загрузка сертификатов

server {
listen 443 ssl;

ssl_certificate /path
ssl_certificate_key /path
}

2. Закрытие портов, кроме 443 и TCP/UDP

Оставлены открытыми только порты 443 (HTTPS) и необходимые порты для работы TCP/UDP


3. Добавление новых пользователей

POST /api/users 

{
"username": "new_user",
"password": "password123",
"role": "user"
}

4. Все порты переделаны на внутренние (127.0.0.1:1234)

Все порты, ранее доступные извне, были изменены на внутренние порты.


5. Отправка RS команд через Web интерфейс

POST /api/rs232/command 


{
"command": "your_command_here"
}
