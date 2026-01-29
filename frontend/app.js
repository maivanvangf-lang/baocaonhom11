// ============= HELPER FUNCTIONS =============
async function postJSON(url, data) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  return resp.json();
}

async function getJSON(url) {
  const resp = await fetch(url);
  return resp.json();
}

function showResult(elementId, data) {
  const el = document.getElementById(elementId);
  el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// ============= TAB NAVIGATION =============
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    // Remove active from all tabs and contents
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Add active to clicked tab
    btn.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

// ============= NÔNG DÂN FORMS =============
// Tạo lô sản phẩm
document.getElementById('batchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    batchId: document.getElementById('batchId').value.trim(),
    product: document.getElementById('product').value.trim(),
    producer: document.getElementById('producer').value.trim(),
    farmLocation: document.getElementById('farmLocation').value.trim(),
    area: document.getElementById('area').value.trim(),
    plantingDate: document.getElementById('plantingDate').value,
    notes: document.getElementById('notes').value.trim()
  };
  const res = await postJSON('/api/batch', data);
  showResult('batchResult', res);
  e.target.reset();
});

// Hoạt động chăm sóc
document.getElementById('farmingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('farmBatchId').value.trim();
  const data = {
    actor: document.getElementById('farmActor').value.trim(),
    activity: document.getElementById('farmActivity').value,
    fertilizer: document.getElementById('fertilizer').value.trim(),
    pesticide: document.getElementById('pesticide').value.trim(),
    notes: document.getElementById('farmNotes').value.trim()
  };
  const res = await postJSON(`/api/farming/${encodeURIComponent(batchId)}`, data);
  showResult('farmingResult', res);
  e.target.reset();
});

// Thu hoạch
document.getElementById('harvestForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('harvestBatchId').value.trim();
  const data = {
    actor: document.getElementById('harvestActor').value.trim(),
    harvestDate: document.getElementById('harvestDate').value,
    quantity: document.getElementById('quantity').value.trim(),
    quality: document.getElementById('quality').value,
    notes: document.getElementById('harvestNotes').value.trim()
  };
  const res = await postJSON(`/api/harvest/${encodeURIComponent(batchId)}`, data);
  showResult('harvestResult', res);
  e.target.reset();
});

// ============= DOANH NGHIỆP FORMS =============
// Kiểm định chất lượng
document.getElementById('qualityForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('qualityBatchId').value.trim();
  const data = {
    inspector: document.getElementById('inspector').value.trim(),
    certification: document.getElementById('certification').value.trim(),
    testResults: document.getElementById('testResults').value.trim(),
    passed: document.getElementById('passed').checked,
    notes: document.getElementById('qualityNotes').value.trim()
  };
  const res = await postJSON(`/api/quality/${encodeURIComponent(batchId)}`, data);
  showResult('qualityResult', res);
  e.target.reset();
});

// Đóng gói
document.getElementById('packagingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('packBatchId').value.trim();
  const data = {
    packager: document.getElementById('packager').value.trim(),
    packageType: document.getElementById('packageType').value,
    quantity: document.getElementById('packQuantity').value.trim(),
    packagingDate: document.getElementById('packagingDate').value,
    notes: document.getElementById('packNotes').value.trim()
  };
  const res = await postJSON(`/api/packaging/${encodeURIComponent(batchId)}`, data);
  showResult('packagingResult', res);
  e.target.reset();
});

// ============= VẬN CHUYỂN FORM =============
document.getElementById('transportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('transBatchId').value.trim();
  const data = {
    transporter: document.getElementById('transporter').value.trim(),
    from: document.getElementById('from').value.trim(),
    to: document.getElementById('to').value.trim(),
    vehicle: document.getElementById('vehicle').value.trim(),
    temperature: document.getElementById('temperature').value.trim(),
    departureTime: document.getElementById('departureTime').value,
    estimatedArrival: document.getElementById('estimatedArrival').value,
    notes: document.getElementById('transNotes').value.trim()
  };
  const res = await postJSON(`/api/transport/${encodeURIComponent(batchId)}`, data);
  showResult('transportResult', res);
  e.target.reset();
});

// ============= SIÊU THỊ FORM =============
document.getElementById('warehouseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('whBatchId').value.trim();
  const data = {
    warehouse: document.getElementById('warehouse').value.trim(),
    action: document.getElementById('whAction').value,
    quantity: document.getElementById('whQuantity').value.trim(),
    condition: document.getElementById('condition').value,
    notes: document.getElementById('whNotes').value.trim()
  };
  const res = await postJSON(`/api/warehouse/${encodeURIComponent(batchId)}`, data);
  showResult('warehouseResult', res);
  e.target.reset();
});

// ============= NGƯỜI TIÊU DÙNG =============
// Truy xuất nguồn gốc
document.getElementById('queryBtn').addEventListener('click', async () => {
  const batchId = document.getElementById('queryBatchId').value.trim();
  if (!batchId) return alert('Vui lòng nhập mã lô');
  
  try {
    const res = await getJSON(`/api/batch/${encodeURIComponent(batchId)}`);
    
    // Format hiển thị đẹp hơn
    let html = `<h3>📦 Lô: ${res.batchId}</h3>`;
    html += `<p><strong>Tổng số bản ghi:</strong> ${res.history.length}</p>`;
    html += '<div class="timeline">';
    
    res.history.forEach((block, idx) => {
      const data = block.data;
      html += `<div class="timeline-item">`;
      html += `<strong>${idx + 1}. ${getActionName(data.type)}</strong> `;
      html += `<small>(${new Date(block.timestamp).toLocaleString('vi-VN')})</small><br>`;
      html += formatBlockData(data);
      html += `</div>`;
    });
    
    html += '</div>';
    document.getElementById('historyResult').innerHTML = html;
  } catch (err) {
    document.getElementById('historyResult').innerHTML = '<p style="color:red;">Không tìm thấy lô hàng!</p>';
  }
});

// Tạo mã QR
document.getElementById('qrBtn').addEventListener('click', async () => {
  const batchId = document.getElementById('qrBatchId').value.trim();
  if (!batchId) return alert('Vui lòng nhập mã lô');
  
  try {
    const res = await getJSON(`/api/qrcode/${encodeURIComponent(batchId)}`);
    document.getElementById('qrDisplay').innerHTML = `
      <h4>Mã QR cho lô: ${res.batchId}</h4>
      <img src="${res.qrCode}" alt="QR Code" style="max-width:300px;" />
      <p><small>URL: <a href="${res.traceUrl}" target="_blank">${res.traceUrl}</a></small></p>
      <p><em>Người tiêu dùng có thể quét mã này để xem thông tin đầy đủ</em></p>
    `;
  } catch (err) {
    document.getElementById('qrDisplay').innerHTML = '<p style="color:red;">Không thể tạo mã QR. Lô hàng có tồn tại không?</p>';
  }
});

// ============= THANH TOÁN =============
// Tạo mã QR thanh toán
document.getElementById('paymentQRForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('payQRBatchId').value.trim();
  const data = {
    amount: parseFloat(document.getElementById('payAmount').value),
    bankAccount: document.getElementById('bankAccount').value.trim(),
    bankName: document.getElementById('bankName').value.trim(),
    accountName: document.getElementById('accountName').value.trim(),
    description: document.getElementById('payDescription').value.trim()
  };
  
  try {
    const res = await postJSON(`/api/payment/qrcode/${encodeURIComponent(batchId)}`, data);
    
    let html = `
      <div class="payment-qr-box">
        <h3>💳 Mã QR Thanh toán</h3>
        <div style="text-align:center; margin:20px 0;">
          <img src="${res.paymentQR}" alt="Payment QR Code" style="max-width:350px; border:3px solid #667eea; border-radius:10px; padding:10px;" />
        </div>
        <div class="payment-info">
          <p><strong>Mã lô:</strong> ${res.batchId}</p>
          <p><strong>Số tiền:</strong> <span style="color:#e74c3c; font-size:1.3em; font-weight:bold;">${res.amount.toLocaleString('vi-VN')} VND</span></p>
          <p><strong>Số tài khoản:</strong> ${res.bankAccount}</p>
          <p><strong>Ngân hàng:</strong> ${res.bankName}</p>
          <p><strong>Chủ tài khoản:</strong> ${res.accountName}</p>
          <p><strong>Nội dung:</strong> ${res.description}</p>
        </div>
        <p style="text-align:center; color:#7f8c8d; font-style:italic; margin-top:20px;">
          Quét mã QR bằng ứng dụng ngân hàng để thanh toán
        </p>
      </div>
    `;
    
    document.getElementById('paymentQRDisplay').innerHTML = html;
    document.getElementById('paymentQRResult').style.display = 'block';
  } catch (err) {
    document.getElementById('paymentQRDisplay').innerHTML = `<p style="color:red;">❌ Lỗi: ${err.message}</p>`;
  }
});

// Ghi nhận thanh toán
document.getElementById('paymentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const batchId = document.getElementById('payBatchId').value.trim();
  const data = {
    buyer: document.getElementById('buyer').value.trim(),
    amount: parseFloat(document.getElementById('paymentAmount').value),
    paymentMethod: document.getElementById('paymentMethod').value,
    transactionId: document.getElementById('transactionId').value.trim(),
    bankAccount: document.getElementById('payBankAccount').value.trim(),
    notes: document.getElementById('payNotes').value.trim()
  };
  
  const res = await postJSON(`/api/payment/${encodeURIComponent(batchId)}`, data);
  
  let html = `
    <div style="background:#d4edda; padding:15px; border-radius:5px; border-left:4px solid #28a745;">
      <h3 style="color:#155724; margin:0 0 10px 0;">✅ Thanh toán thành công!</h3>
      <p><strong>Mã giao dịch:</strong> ${res.block.data.transactionId}</p>
      <p><strong>Người mua:</strong> ${res.block.data.buyer}</p>
      <p><strong>Số tiền:</strong> ${res.block.data.amount.toLocaleString('vi-VN')} VND</p>
      <p><strong>Phương thức:</strong> ${res.block.data.paymentMethod}</p>
      <p><strong>Thời gian:</strong> ${new Date(res.block.data.paymentDate).toLocaleString('vi-VN')}</p>
      <p style="color:#6c757d; font-size:0.9em; margin-top:10px;">Block #${res.block.index} đã được ghi vào blockchain</p>
    </div>
  `;
  
  showResult('paymentResult', {message: res.message, data: res.block.data});
  e.target.reset();
});

// Xem lịch sử thanh toán
document.getElementById('payHistoryBtn').addEventListener('click', async () => {
  const batchId = document.getElementById('payHistoryBatchId').value.trim();
  
  if (!batchId) {
    document.getElementById('payHistoryResult').innerHTML = '<p style="color:red;">Vui lòng nhập mã lô</p>';
    return;
  }
  
  try {
    const res = await getJSON(`/api/payment/${encodeURIComponent(batchId)}`);
    
    if (res.totalPayments === 0) {
      document.getElementById('payHistoryResult').innerHTML = '<p>Chưa có giao dịch thanh toán nào cho lô này.</p>';
      return;
    }
    
    let totalAmount = res.payments.reduce((sum, p) => sum + p.amount, 0);
    
    let html = `
      <h3>💰 Lịch sử thanh toán - ${res.batchId}</h3>
      <p><strong>Tổng số giao dịch:</strong> ${res.totalPayments}</p>
      <p><strong>Tổng doanh thu:</strong> <span style="color:#27ae60; font-size:1.2em; font-weight:bold;">${totalAmount.toLocaleString('vi-VN')} VND</span></p>
      <div class="timeline">
    `;
    
    res.payments.forEach((payment, index) => {
      html += `
        <div class="timeline-item" style="border-left:3px solid #27ae60;">
          <strong>💳 Giao dịch #${index + 1}</strong> 
          <small>(${new Date(payment.paymentDate).toLocaleString('vi-VN')})</small>
          <ul>
            <li><strong>Người mua:</strong> ${payment.buyer}</li>
            <li><strong>Số tiền:</strong> ${payment.amount.toLocaleString('vi-VN')} VND</li>
            <li><strong>Phương thức:</strong> ${payment.paymentMethod}</li>
            <li><strong>Mã GD:</strong> ${payment.transactionId}</li>
            ${payment.notes ? `<li><strong>Ghi chú:</strong> ${payment.notes}</li>` : ''}
          </ul>
        </div>
      `;
    });
    
    html += '</div>';
    document.getElementById('payHistoryResult').innerHTML = html;
  } catch (err) {
    document.getElementById('payHistoryResult').innerHTML = `<p style="color:red;">❌ Lỗi: Không tìm thấy lô hàng</p>`;
  }
});

// ============= QUẢN LÝ =============
// Thống kê
document.getElementById('statsBtn').addEventListener('click', async () => {
  const res = await getJSON('/api/statistics');
  let html = `
    <h3>📈 Thống kê hệ thống</h3>
    <p><strong>Tổng số lô sản phẩm:</strong> ${res.totalBatches}</p>
    <p><strong>Tổng số log:</strong> ${res.totalLogs}</p>
    <p><strong>Tổng số block:</strong> ${res.totalBlocks}</p>
    <p><strong>Trạng thái blockchain:</strong> <span style="color:${res.isValid ? 'green' : 'red'}">${res.isValid ? '✅ Hợp lệ' : '❌ Bị thay đổi'}</span></p>
    <h4>Hoạt động gần đây (10 giao dịch cuối):</h4>
    <div class="timeline">
  `;
  
  res.recentActivity.forEach(block => {
    html += `<div class="timeline-item">
      <strong>${getActionName(block.data.type)}</strong> 
      <small>(${new Date(block.timestamp).toLocaleString('vi-VN')})</small><br>
      ${formatBlockData(block.data)}
    </div>`;
  });
  
  html += '</div>';
  document.getElementById('statsResult').innerHTML = html;
});

// Danh sách lô
document.getElementById('listBtn').addEventListener('click', async () => {
  const res = await getJSON('/api/batches');
  let html = `<h4>Tổng số lô: ${res.count}</h4><table class="batch-table">
    <tr><th>Mã lô</th><th>Sản phẩm</th><th>Người sản xuất</th><th>Vị trí</th><th>Thời gian</th></tr>`;
  
  res.batches.forEach(b => {
    html += `<tr>
      <td>${b.batchId}</td>
      <td>${b.product}</td>
      <td>${b.producer}</td>
      <td>${b.farmLocation || 'N/A'}</td>
      <td>${new Date(b.timestamp).toLocaleString('vi-VN')}</td>
    </tr>`;
  });
  
  html += '</table>';
  document.getElementById('listResult').innerHTML = html;
});

// Validate blockchain
document.getElementById('validateBtn').addEventListener('click', async () => {
  const res = await getJSON('/api/validate');
  const color = res.valid ? 'green' : 'red';
  document.getElementById('validateResult').innerHTML = `
    <h3 style="color:${color}">${res.valid ? '✅' : '❌'} ${res.message}</h3>
  `;
});

// ============= HELPER DISPLAY FUNCTIONS =============
function getActionName(type) {
  const names = {
    'batch': '🌱 Tạo lô sản phẩm',
    'farming': '🚜 Hoạt động chăm sóc',
    'harvest': '🌾 Thu hoạch',
    'quality': '🔬 Kiểm định chất lượng',
    'packaging': '📦 Đóng gói',
    'transport': '🚚 Vận chuyển',
    'warehouse': '🏪 Nhập/Xuất kho',
    'payment': '💳 Thanh toán',
    'log': '📝 Log khác'
  };
  return names[type] || type;
}

function formatBlockData(data) {
  let html = '<ul>';
  for (let key in data) {
    if (key !== 'type' && key !== 'batchId' && data[key]) {
      html += `<li><strong>${key}:</strong> ${data[key]}</li>`;
    }
  }
  html += '</ul>';
  return html;
}
