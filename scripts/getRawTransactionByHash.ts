import { getTransactionByHash } from './getTransactionByHash';
import { serialize } from './serialize';

export const getRawTransactionByHash = async (txHash: string, verbose = false) => {

    const txObject = await getTransactionByHash(txHash);
    if(verbose){
        console.log(`getting raw transction of object ${txObject.hash}`);
    }
    const txRaw = serialize(txObject);

    return txRaw;
}


// 0x02f873011384 + maxprio: 59682f00 + 850 + maxfee: 20c78b187 + 82 + gasPrice: 5208 + 94 + to: 3fe333174046c438268b220004975a7c77f65304 + 880 + value: 1e4a88b22e9a331 + 80c001a0  + r: b2c6776a0d9130ec204a94a88fc5764cfecb272ad2c45caea98f8784783f5ab3 + a0 + s: 1afb1db1991395b5bd699bb09a0002ea0bb7c07c962b002bab16cddc1292dbb4
// 0x02f871011384 + maxprio: 59682f00 + 850 + maxfee: 20c78b187 + 8094                     + to: 3fe333174046c438268b220004975a7c77f65304 + 880 + value: 1e4a88b22e9a331 + 80c001a0  + r: b2c6776a0d9130ec204a94a88fc5764cfecb272ad2c45caea98f8784783f5ab3 + a0 + s: 1afb1db1991395b5bd699bb09a0002ea0bb7c07c962b002bab16cddc1292dbb4

// 0x02f872017884 59682f008502d17865e9 82520894 7e3de12f418ab25838cbb5251c793d17f2dc0224877b87d197f97aa880c001a0dff243ce92b70442173b8f7415a87284770b04744cff4cde9fefe93ca61d8af3a02281dd337ba6221bb1baf34bb11bd201d02839ddebaebf172855691e5d755627
// 0x02f870017884 59682f008502d17865e9 8094     7e3de12f418ab25838cbb5251c793d17f2dc0224877b87d197f97aa880c001a0dff243ce92b70442173b8f7415a87284770b04744cff4cde9fefe93ca61d8af3a02281dd337ba6221bb1baf34bb11bd201d02839ddebaebf172855691e5d755627
// 0x02f87201788459682f008502d17865e9825208947e3de12f418ab25838cbb5251c793d17f2dc0224877b87d197f97aa880c001a0dff243ce92b70442173b8f7415a87284770b04744cff4cde9fefe93ca61d8af3a02281dd337ba6221bb1baf34bb11bd201d02839ddebaebf172855691e5d755627