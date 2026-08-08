FROM ubuntu:22.04

# Добавляем архитектуру armhf
RUN dpkg --add-architecture armhf

# Устанавливаем инструменты
RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    cmake \
    gcc-arm-linux-gnueabihf \
    g++-arm-linux-gnueabihf \
    libssl-dev \
    libssl-dev:armhf \
    pkg-config \
    wget \
    nlohmann-json3-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Boost для ARM
RUN apt-get update && apt-get install -y \
    libboost1.74-dev:armhf \
    libboost-system1.74-dev:armhf \
    libboost-thread1.74-dev:armhf \
    libboost-filesystem1.74-dev:armhf \
    libboost-program-options1.74-dev:armhf \
    libboost-date-time1.74-dev:armhf \
    && rm -rf /var/lib/apt/lists/*

# Копируем заголовки nlohmann/json для ARM
RUN mkdir -p /usr/include/arm-linux-gnueabihf/nlohmann && \
    cp -r /usr/include/nlohmann/* /usr/include/arm-linux-gnueabihf/nlohmann/ 2>/dev/null || true

ENV CC=arm-linux-gnueabihf-gcc
ENV CXX=arm-linux-gnueabihf-g++

WORKDIR /workspace