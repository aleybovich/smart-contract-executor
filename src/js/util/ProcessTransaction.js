/*
    Method executes a smart contract transaction and waits for it to get mined

    contract  - contract instance
    functionName - contract function to call
    options - transaction options object, e.g. {from: 0x01234, gas: 3000000}
    args - arguments to pass to the function
    callback
 */
exports.ProcessTransaction = (contract, functionName, args, options) => {
    if (!contract) {
        throw Error("contract can't be null");
    }

    if (!functionName) {
        throw Error("function name can't be null");
    }

    if (!contract[functionName]) {
        throw Error(`Contract doesn't contain function ${functionName}`);
    }

    // args can be null, array or a single value. force it to be an array (empty array if null)
    // we are doing it for simplicity - later we can just pass it at ..args
    if(!args) args = []
    else if (!Array.isArray(args)) args = [args];

    return new Promise ((resolve, reject) => {
        contract[functionName].sendTransaction(...args, options, ( error, txHash ) => {
            if (error) reject(error)
            else {
                getTransactionReceiptMined(txHash, 1000)
                    .then(receipt => resolve(receipt))
                    .catch(error => reject(error));
            }
        });
    })    
}

const getTransactionReceiptMined = function getTransactionReceiptMined(txHash, interval) {
    const self = web3.eth;
    const transactionReceiptAsync = function(resolve, reject) {
        self.getTransactionReceipt(txHash, (error, receipt) => {
            if (error) {
                reject(error);
            } else if (receipt == null) {
                setTimeout(
                    () => transactionReceiptAsync(resolve, reject),
                    interval ? interval : 500);
            } else {
                resolve(receipt);
            }
        });
    };

    if (Array.isArray(txHash)) {
        return Promise.all(txHash.map(
            oneTxHash => self.getTransactionReceiptMined(oneTxHash, interval)));
    } else if (typeof txHash === "string") {
        return new Promise(transactionReceiptAsync);
    } else {
        throw new Error("Invalid Type: " + txHash);
    }
};