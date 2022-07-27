
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'


//TODO can add a transaction class later on
//TODO add other types of transactions
export const serialize = (txObject: any) => {

    

    const tx = FeeMarketEIP1559Transaction.fromTxData(
        etherJsTransactionWrapper(
            txObject
    ));

    const rawTransaction = "0x" + tx.serialize().toString('hex');
    
    return rawTransaction;
}

const etherJsTransactionWrapper = (txObject: any) => {
    txObject.gasLimit = txObject.gas
    txObject.gas = undefined

    return txObject
}