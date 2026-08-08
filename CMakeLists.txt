cmake_minimum_required(VERSION 3.12)
project(RS_Gateway_Backend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Флаги для ARM
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2 -Wall -Wextra -pthread")

# Явные пути для ARM кросс-компиляции
set(BOOST_INCLUDE_DIR "/usr/include")
set(BOOST_LIBRARY_DIR "/usr/lib/arm-linux-gnueabihf")
set(BOOST_SYSTEM_LIBRARY "${BOOST_LIBRARY_DIR}/libboost_system.so")
set(BOOST_FILESYSTEM_LIBRARY "${BOOST_LIBRARY_DIR}/libboost_filesystem.so")

set(OPENSSL_INCLUDE_DIR "/usr/include")
set(OPENSSL_LIBRARY_DIR "/usr/lib/arm-linux-gnueabihf")
set(OPENSSL_SSL_LIBRARY "${OPENSSL_LIBRARY_DIR}/libssl.so")
set(OPENSSL_CRYPTO_LIBRARY "${OPENSSL_LIBRARY_DIR}/libcrypto.so")

set(JSON_INCLUDE_DIR "/usr/include")

message(STATUS "Boost system: ${BOOST_SYSTEM_LIBRARY}")
message(STATUS "Boost filesystem: ${BOOST_FILESYSTEM_LIBRARY}")
message(STATUS "OpenSSL libs: ${OPENSSL_SSL_LIBRARY} ${OPENSSL_CRYPTO_LIBRARY}")
message(STATUS "JSON include: ${JSON_INCLUDE_DIR}")

# Проверяем файлы
foreach(lib IN ITEMS ${BOOST_SYSTEM_LIBRARY} ${BOOST_FILESYSTEM_LIBRARY} ${OPENSSL_SSL_LIBRARY} ${OPENSSL_CRYPTO_LIBRARY})
    if(NOT EXISTS ${lib})
        message(FATAL_ERROR "Library not found: ${lib}")
    endif()
endforeach()

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${BOOST_INCLUDE_DIR}
    ${OPENSSL_INCLUDE_DIR}
    ${JSON_INCLUDE_DIR}
)

add_executable(rs_gateway
    src/AuthHandler.cpp
    src/Logger.cpp
    src/Router.cpp
    src/Server.cpp
    src/SettingsHandler.cpp
    src/WebSocketClient.cpp
    src/bcrypt.cpp
    src/main.cpp
)

target_link_libraries(rs_gateway
    ${BOOST_SYSTEM_LIBRARY}
    ${BOOST_FILESYSTEM_LIBRARY}
    ${OPENSSL_SSL_LIBRARY}
    ${OPENSSL_CRYPTO_LIBRARY}
    pthread
    dl
    rt
)

# Копирование конфига
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/config.json 
               ${CMAKE_CURRENT_BINARY_DIR}/config.json COPYONLY)