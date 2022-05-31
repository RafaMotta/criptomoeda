const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
    constructor(index, timestamp, data, previousHash = '') {
        //NUMERO UNICO QUE RASTREIA A POSICAO DO BLOCO NA CADEIA
        this.index = index;
        // DATA QUE BLOCO FOI CRIADO    
        this.timestamp = timestamp;
        //DADOS QUE CONTEM NO BLOCO
        this.data = data;
        //HASH DO BLOCO ANTERIOR
        this.previousHash = previousHash;
        //HASH DO BLOCO
        this.hash = this.cumputedHash();
        //NUMERO QUE SERA INCREMENTADO PARA CADA BLOCO
        this.nonce = 0;
    }

    cumputedHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    proofOfWork(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.cumputedHash();
        }
    }

}

class CryptoBlockchain {
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }

    //PRIMEIRO BLOCO DA BLOCKCHAIN
    startGenesisBlock() {
        return new CryptoBlock(0, "31/05/2022", "Genesis Block", "0");
    }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.obtainLatestBlock().hash;
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }

    //CHECA SE O BLOCO É VALIDO
    checkChainValidity() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

let crypto = new CryptoBlockchain();

console.log("mineirando um novo bloco");
crypto.addBlock(new CryptoBlock(1, "31/05/2022", 
    { 
        sender: "Leonardo",
        recipient: "João",
        quantity: 4,
    })
);

crypto.addBlock(new CryptoBlock(2, "01/06/2022", 
    { 
        sender: "Ricardo",
        recipient: "Lucas",
        quantity: 20,
    })
);

console.log(JSON.stringify(crypto, null, 4));