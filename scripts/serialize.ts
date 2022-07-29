
import { FeeMarketEIP1559Transaction, AccessListEIP2930Transaction, Transaction } from '@ethereumjs/tx'


//TODO can add a transaction class later on
//TODO add other types of transactions
export const serialize = (txObject: any) => {

    let tx;
    const wrappedTx = etherJsTransactionWrapper(txObject)

    switch(txObject.type){
        case "0x0":
            tx = Transaction.fromTxData(wrappedTx);
            break
        case "0x1":
            tx = AccessListEIP2930Transaction.fromTxData(wrappedTx);
            break
        case "0x2":
            tx = FeeMarketEIP1559Transaction.fromTxData(wrappedTx);
            break
        default:
            throw Error("Invalid Transaction Type!");
    }

    const rawTransaction = "0x" + tx.serialize().toString('hex');
    
    return rawTransaction;
}

const etherJsTransactionWrapper = (txObject: any) => {
    txObject.gasLimit = txObject.gas
    txObject.gas = undefined

    txObject.data = txObject.input

    return txObject
}