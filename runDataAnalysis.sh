#!/bin/bash

while true
do
    npx hardhat run scripts/dataAnalysis/blockCensorshipAnalysis.ts >> censorshipData.js
    echo "Error"
    sleep 2
done