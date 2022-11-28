import { nodeAPIKey } from "../../config";
import fetch from "node-fetch";

export async function fetchReceiptsFromBlock(blockNumber: number){
    const url = nodeAPIKey;
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'alchemy_getTransactionReceipts',
            params: [{blockNumber:  "0x" + blockNumber.toString(16)}]
        })
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return data.result.receipts;
}