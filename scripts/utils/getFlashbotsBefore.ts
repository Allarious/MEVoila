import fetch from "node-fetch";

export async function getFlashbotsBefore(blockNumber: number, limit: number = 100){
    const url = `https://blocks.flashbots.net/v1/blocks?before=${blockNumber}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.blocks;
}