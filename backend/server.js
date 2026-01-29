const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const QRCode = require('qrcode');
const Blockchain = require('./blockchain');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const ledger = new Blockchain();

// Routes

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', valid: ledger.isChainValid(), blocks: ledger.chain.length });
});

// ============= API CHO NÔNG DÂN / HỢP TÁC XÃ =============
// Tạo lô sản phẩm mới
app.post('/api/batch', (req, res) => {
  const { batchId, product, producer, farmLocation, notes, area, plantingDate } = req.body;
  if (!batchId || !product || !producer) {
    return res.status(400).json({ error: 'batchId, product and producer are required' });
  }
  const data = {
    type: 'batch',
    batchId,
    product,
    producer,
    farmLocation: farmLocation || '',
    notes: notes || '',
    area: area || '',
    plantingDate: plantingDate || new Date().toISOString(),
    status: 'created'
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Batch created', block });
});

// Ghi nhận hoạt động chăm sóc (phân bón, thuốc BVTV, tưới tiêu)
app.post('/api/farming/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { activity, fertilizer, pesticide, wateringSchedule, notes, actor } = req.body;
  if (!actor) {
    return res.status(400).json({ error: 'actor is required' });
  }
  const data = {
    type: 'farming',
    batchId,
    activity: activity || 'care',
    fertilizer: fertilizer || '',
    pesticide: pesticide || '',
    wateringSchedule: wateringSchedule || '',
    notes: notes || '',
    actor
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Farming activity logged', block });
});

// Ghi nhận thu hoạch
app.post('/api/harvest/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { harvestDate, quantity, quality, notes, actor } = req.body;
  if (!actor || !quantity) {
    return res.status(400).json({ error: 'actor and quantity are required' });
  }
  const data = {
    type: 'harvest',
    batchId,
    harvestDate: harvestDate || new Date().toISOString(),
    quantity,
    quality: quality || 'good',
    notes: notes || '',
    actor
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Harvest logged', block });
});

// ============= API CHO DOANH NGHIỆP / NHÀ CHẾ BIẾN =============
// Kiểm định chất lượng
app.post('/api/quality/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { inspector, testResults, certification, passed, notes } = req.body;
  if (!inspector) {
    return res.status(400).json({ error: 'inspector is required' });
  }
  const data = {
    type: 'quality',
    batchId,
    inspector,
    testResults: testResults || '',
    certification: certification || '',
    passed: passed !== undefined ? passed : true,
    notes: notes || '',
    testDate: new Date().toISOString()
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Quality inspection logged', block });
});

// Đóng gói sản phẩm
app.post('/api/packaging/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { packager, packageType, quantity, packagingDate, notes } = req.body;
  if (!packager) {
    return res.status(400).json({ error: 'packager is required' });
  }
  const data = {
    type: 'packaging',
    batchId,
    packager,
    packageType: packageType || 'standard',
    quantity: quantity || '',
    packagingDate: packagingDate || new Date().toISOString(),
    notes: notes || ''
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Packaging logged', block });
});

// ============= API CHO ĐƠN VỊ VẬN CHUYỂN =============
// Ghi nhận vận chuyển
app.post('/api/transport/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { transporter, from, to, vehicle, temperature, departureTime, estimatedArrival, notes } = req.body;
  if (!transporter || !from || !to) {
    return res.status(400).json({ error: 'transporter, from and to are required' });
  }
  const data = {
    type: 'transport',
    batchId,
    transporter,
    from,
    to,
    vehicle: vehicle || '',
    temperature: temperature || '',
    departureTime: departureTime || new Date().toISOString(),
    estimatedArrival: estimatedArrival || '',
    notes: notes || ''
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Transport logged', block });
});

// ============= API CHO SIÊU THỊ / CỬA HÀNG =============
// Nhập kho
app.post('/api/warehouse/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { warehouse, action, quantity, condition, notes } = req.body;
  if (!warehouse || !action) {
    return res.status(400).json({ error: 'warehouse and action are required' });
  }
  const data = {
    type: 'warehouse',
    batchId,
    warehouse,
    action, // 'import' or 'export'
    quantity: quantity || '',
    condition: condition || 'good',
    notes: notes || '',
    timestamp: new Date().toISOString()
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Warehouse activity logged', block });
});

// ============= API CHUNG =============
// Add general log (backward compatible)
app.post('/api/log/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { action, details, actor } = req.body;
  if (!action || !actor) {
    return res.status(400).json({ error: 'action and actor are required' });
  }
  const data = {
    type: 'log',
    batchId,
    action,
    details: details || '',
    actor
  };
  const block = ledger.addBlock(data);
  res.json({ message: 'Log added', block });
});

// Get batch full history
app.get('/api/batch/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const blocks = ledger.findBatch(batchId);
  if (!blocks || blocks.length === 0) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  res.json({ batchId, history: blocks });
});

// List batches summary
app.get('/api/batches', (req, res) => {
  const list = ledger.getAllBatchesSummary();
  res.json({ count: list.length, batches: list });
});

// ============= API TẠO MÃ QR =============
// Tạo mã QR cho lô sản phẩm
app.get('/api/qrcode/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const blocks = ledger.findBatch(batchId);
  
  if (!blocks || blocks.length === 0) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  
  try {
    // URL để người tiêu dùng quét QR
    const traceUrl = `${req.protocol}://${req.get('host')}/trace.html?batch=${batchId}`;
    
    // Tạo QR code dưới dạng Data URL
    const qrDataUrl = await QRCode.toDataURL(traceUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    res.json({ 
      batchId, 
      qrCode: qrDataUrl, 
      traceUrl 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code', details: err.message });
  }
});

// ============= API THANH TOÁN (NGÂN HÀNG) =============
// Tạo mã QR thanh toán VietQR
app.post('/api/payment/qrcode/:batchId', async (req, res) => {
  const batchId = req.params.batchId;
  const { amount, bankAccount, bankName, accountName, description } = req.body;
  
  if (!amount || !bankAccount) {
    return res.status(400).json({ error: 'amount and bankAccount are required' });
  }
  
  const blocks = ledger.findBatch(batchId);
  if (!blocks || blocks.length === 0) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  
  try {
    // Format VietQR: https://vietqr.io/
    // Format: bankAccount|bankName|accountName|amount|description|template
    const paymentInfo = `Thanh toan ma lo: ${batchId}\nSo tien: ${amount} VND\nTK: ${bankAccount}\nNH: ${bankName || 'N/A'}\nChu TK: ${accountName || 'N/A'}`;
    
    // Tạo QR code cho thanh toán
    const qrDataUrl = await QRCode.toDataURL(paymentInfo, {
      width: 350,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    res.json({ 
      batchId,
      paymentQR: qrDataUrl,
      amount,
      bankAccount,
      bankName: bankName || 'N/A',
      accountName: accountName || 'N/A',
      description: description || `Thanh toán mã lô ${batchId}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate payment QR', details: err.message });
  }
});

// Ghi nhận giao dịch thanh toán
app.post('/api/payment/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const { buyer, amount, paymentMethod, transactionId, bankAccount, notes } = req.body;
  
  if (!buyer || !amount) {
    return res.status(400).json({ error: 'buyer and amount are required' });
  }
  
  const data = {
    type: 'payment',
    batchId,
    buyer,
    amount: parseFloat(amount),
    paymentMethod: paymentMethod || 'bank_transfer',
    transactionId: transactionId || `TXN-${Date.now()}`,
    bankAccount: bankAccount || '',
    notes: notes || '',
    paymentDate: new Date().toISOString(),
    status: 'completed'
  };
  
  const block = ledger.addBlock(data);
  res.json({ message: 'Payment recorded successfully', block });
});

// Lấy danh sách giao dịch của một lô
app.get('/api/payment/:batchId', (req, res) => {
  const batchId = req.params.batchId;
  const blocks = ledger.findBatch(batchId);
  
  if (!blocks || blocks.length === 0) {
    return res.status(404).json({ error: 'Batch not found' });
  }
  
  // Lọc các giao dịch thanh toán
  const payments = blocks.filter(block => block.data.type === 'payment');
  
  res.json({ 
    batchId, 
    totalPayments: payments.length,
    payments: payments.map(b => b.data)
  });
});

// ============= API CHO CƠ QUAN QUẢN LÝ =============
// Dashboard thống kê
app.get('/api/statistics', (req, res) => {
  const stats = ledger.getStatistics();
  res.json(stats);
});

// Kiểm tra tính toàn vẹn blockchain
app.get('/api/validate', (req, res) => {
  const isValid = ledger.isChainValid();
  res.json({ 
    valid: isValid, 
    message: isValid ? 'Blockchain is valid' : 'Blockchain has been tampered!' 
  });
});

// Serve index.html at root (static)
// Already served from /public

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Blockchain Traceability System v2.0`);
  console.log(`- Main interface: http://localhost:${PORT}`);
  console.log(`- API endpoints available for: Farmers, Enterprises, Transport, Warehouses`);
});
