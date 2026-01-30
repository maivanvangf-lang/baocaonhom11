const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const CHAIN_FILE = path.join(__dirname, '..', 'database', 'chain.json');

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

class Block {
  constructor(index, timestamp, data, previousHash='') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data; // object
    this.previousHash = previousHash;
    this.hash = this.computeHash();
  }

  computeHash() {
    return sha256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.load();
    if (this.chain.length === 0) {
      this.createGenesisBlock();
      this.save();
    }
  }

  createGenesisBlock() {
    const genesis = new Block(0, new Date().toISOString(), { info: 'Genesis Block' }, '0');
    this.chain.push(genesis);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const index = this.chain.length;
    const previousHash = this.getLatestBlock().hash;
    const block = new Block(index, new Date().toISOString(), data, previousHash);
    this.chain.push(block);
    this.save();
    return block;
  }

  findBatch(batchId) {
    // Each block's data may contain { type: 'batch' } or { type: 'log' }
    // We will find blocks whose data.batchId == batchId
    return this.chain.filter(b => b.data && b.data.batchId === batchId);
  }

  getAllBatchesSummary() {
    // summary based on blocks with type 'batch'
    return this.chain
      .filter(b => b.data && b.data.type === 'batch')
      .map(b => ({ 
        batchId: b.data.batchId, 
        product: b.data.product, 
        timestamp: b.timestamp, 
        producer: b.data.producer,
        farmLocation: b.data.farmLocation || '',
        status: b.data.status || 'active'
      }));
  }

  // Lấy tất cả logs của một lô theo loại hành động
  findBatchLogsByType(batchId, logType) {
    return this.chain.filter(b => 
      b.data && 
      b.data.batchId === batchId && 
      b.data.type === logType
    );
  }

  // Thống kê tổng quan cho dashboard quản lý
  getStatistics() {
    const batches = this.chain.filter(b => b.data && b.data.type === 'batch');
    const logs = this.chain.filter(b => b.data && b.data.type && b.data.type !== 'batch' && b.data.type !== 'info');
    
    return {
      totalBatches: batches.length,
      totalLogs: logs.length,
      totalBlocks: this.chain.length,
      isValid: this.isChainValid(),
      recentActivity: this.chain.slice(-10).reverse()
    };
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.computeHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  save() {
    try {
      fs.writeFileSync(CHAIN_FILE, JSON.stringify(this.chain, null, 2));
    } catch (err) {
      console.error('Failed to save chain:', err);
    }
  }

  load() {
    try {
      if (fs.existsSync(CHAIN_FILE)) {
        const raw = fs.readFileSync(CHAIN_FILE);
        const arr = JSON.parse(raw);
        this.chain = arr.map(a => {
          const b = new Block(a.index, a.timestamp, a.data, a.previousHash);
          // ensure stored hash remains (prevent recompute drift)
          b.hash = a.hash;
          return b;
        });
      } else {
        this.chain = [];
      }
    } catch (err) {
      console.error('Failed to load chain:', err);
      this.chain = [];
    }
  }
}

module.exports = Blockchain;
