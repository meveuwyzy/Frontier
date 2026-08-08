#!/bin/bash
docker build -t rs-gateway-cross-compile .
docker run --rm -v "$(pwd):/workspace" rs-gateway-cross-compile /bin/bash -c "
cd /workspace && \
rm -rf build && \
mkdir -p build && \
cd build && \
cmake -DCMAKE_TOOLCHAIN_FILE=../toolchain.cmake .. && \
make -j4
"