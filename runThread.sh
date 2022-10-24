#!/bin/bash

while true
do
    npx hardhat run scripts/threads/thread$1.ts
    sleep 2
done