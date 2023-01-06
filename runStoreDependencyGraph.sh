#!/bin/bash

export NODE_OPTIONS=--max_old_space_size=8192

while true
do
    npx hardhat run scripts/storeDependacyGraphByBlockNumber.ts >> censorshipRunLog.js
    echo "Errorm rerunning the program..."
    sleep 2
done