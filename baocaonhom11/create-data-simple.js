// Script tạo 20 lô trái cây miền Tây - Phiên bản tương thích Node.js
const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 3000;

// Danh sách 20 loại trái cây miền Tây
const fruits = [
  { name: 'Xoài Cát Hòa Lộc', location: 'Đồng Tháp', area: '2 hecta', farmer: 'HTX Đồng Tháp' },
  { name: 'Sầu Riêng Ri6', location: 'Tiền Giang', area: '3 hecta', farmer: 'Nông trại Mỹ Tho' },
  { name: 'Chôm Chôm', location: 'Bến Tre', area: '1.5 hecta', farmer: 'HTX Bến Tre' },
  { name: 'Bưởi Năm Roi', location: 'Vĩnh Long', area: '2.5 hecta', farmer: 'Vườn Bưởi Năm Roi' },
  { name: 'Nhãn Lồng', location: 'An Giang', area: '1.8 hecta', farmer: 'HTX An Giang' },
  { name: 'Măng Cụt', location: 'Cần Thơ', area: '2.2 hecta', farmer: 'Nông trại Cần Thơ' },
  { name: 'Vú Sữa Lò Rèn', location: 'Vĩnh Long', area: '1.2 hecta', farmer: 'Vườn Vú Sữa' },
  { name: 'Cam Sành', location: 'Hậu Giang', area: '3.5 hecta', farmer: 'HTX Hậu Giang' },
  { name: 'Thanh Long Ruột Đỏ', location: 'Tiền Giang', area: '4 hecta', farmer: 'Nông trại Thanh Long' },
  { name: 'Dừa Xiêm', location: 'Bến Tre', area: '5 hecta', farmer: 'HTX Dừa Bến Tre' },
  { name: 'Mít Thái', location: 'Trà Vinh', area: '2.8 hecta', farmer: 'Vườn Mít Trà Vinh' },
  { name: 'Ổi Nữ Hoàng', location: 'Long An', area: '1.5 hecta', farmer: 'HTX Long An' },
  { name: 'Dưa Hấu', location: 'Sóc Trăng', area: '6 hecta', farmer: 'Nông trại Dưa Sóc Trăng' },
  { name: 'Chanh Dây', location: 'Cà Mau', area: '1.3 hecta', farmer: 'HTX Cà Mau' },
  { name: 'Mãng Cầu Xiêm', location: 'Kiên Giang', area: '2.4 hecta', farmer: 'Vườn Kiên Giang' },
  { name: 'Bơ Booth', location: 'Đồng Tháp', area: '1.7 hecta', farmer: 'Nông trại Bơ' },
  { name: 'Lê Hàn Quốc', location: 'Vĩnh Long', area: '1.2 hecta', farmer: 'HTX Vĩnh Long' },
  { name: 'Dâu Tây', location: 'Lâm Đồng', area: '0.8 hecta', farmer: 'Nông trại Dâu Tây' },
  { name: 'Hồng Giòn', location: 'An Giang', area: '2 hecta', farmer: 'Vườn Hồng An Giang' },
  { name: 'Vải Thiều', location: 'Hưng Yên', area: '2.5 hecta', farmer: 'HTX Vải Hưng Yên' }
];

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ success: true });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function createBatch(index) {
  const fruit = fruits[index];
  const batchId = `LOT-2025-${String(index + 1).padStart(3, '0')}`;
  
  console.log(`\n🌱 Đang tạo ${batchId}: ${fruit.name}...`);
  
  try {
    // 1. Tạo lô sản phẩm
    await makeRequest('/api/batch', 'POST', {
      batchId,
      product: fruit.name,
      producer: fruit.farmer,
      farmLocation: fruit.location,
      area: fruit.area,
      plantingDate: `2025-01-${String(index + 1).padStart(2, '0')}`,
      notes: `Trái cây đặc sản miền Tây`
    });
    console.log(`  ✅ Tạo lô thành công`);
    
    // 2. Ghi nhận chăm sóc
    await makeRequest(`/api/farming/${batchId}`, 'POST', {
      actor: fruit.farmer,
      activity: 'fertilizing',
      fertilizer: 'Phân hữu cơ NPK 16-16-8',
      pesticide: 'Không sử dụng hóa chất',
      notes: 'Canh tác theo tiêu chuẩn VietGAP'
    });
    console.log(`  ✅ Ghi nhận chăm sóc`);
    
    // 3. Thu hoạch
    await makeRequest(`/api/harvest/${batchId}`, 'POST', {
      actor: `Đội thu hoạch ${fruit.farmer}`,
      harvestDate: `2025-11-${String(index + 1).padStart(2, '0')}`,
      quantity: `${(index + 1) * 50} kg`,
      quality: index % 3 === 0 ? 'excellent' : 'good',
      notes: 'Thu hoạch đúng độ chín'
    });
    console.log(`  ✅ Ghi nhận thu hoạch`);
    
    // 4. Kiểm định chất lượng
    await makeRequest(`/api/quality/${batchId}`, 'POST', {
      inspector: 'Trung tâm Kiểm định Chất lượng Nông sản',
      certification: index % 2 === 0 ? 'VietGAP' : 'GlobalGAP',
      testResults: 'Đạt tiêu chuẩn an toàn thực phẩm',
      passed: true,
      notes: 'Không có dư lượng thuốc BVTV'
    });
    console.log(`  ✅ Kiểm định chất lượng`);
    
    // 5. Đóng gói
    await makeRequest(`/api/packaging/${batchId}`, 'POST', {
      packager: 'Công ty Đóng gói Nông sản Miền Tây',
      packageType: 'box',
      quantity: `${(index + 1) * 2} thùng`,
      packagingDate: `2025-11-${String(index + 2).padStart(2, '0')}`,
      notes: 'Đóng gói chân không, giữ tươi'
    });
    console.log(`  ✅ Đóng gói`);
    
    // 6. Vận chuyển
    await makeRequest(`/api/transport/${batchId}`, 'POST', {
      transporter: 'Vận tải Hoàng Long',
      from: fruit.location,
      to: 'TP. Hồ Chí Minh',
      vehicle: 'Xe tải lạnh 5 tấn',
      temperature: '5-8°C',
      departureTime: `2025-11-${String(index + 3).padStart(2, '0')}T06:00:00Z`,
      estimatedArrival: `2025-11-${String(index + 3).padStart(2, '0')}T12:00:00Z`,
      notes: 'Vận chuyển an toàn'
    });
    console.log(`  ✅ Vận chuyển`);
    
    // 7. Nhập kho
    await makeRequest(`/api/warehouse/${batchId}`, 'POST', {
      warehouse: `Co.opMart ${['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7'][index % 4]}`,
      action: 'import',
      quantity: `${(index + 1) * 2} thùng`,
      condition: 'excellent',
      notes: 'Nhập kho đầy đủ'
    });
    console.log(`  ✅ Nhập kho`);
    
    console.log(`\n✨ Hoàn tất ${batchId}: ${fruit.name}\n`);
    
  } catch (error) {
    console.error(`❌ Lỗi khi tạo ${batchId}:`, error.message);
  }
}

async function createAllBatches() {
  console.log('🚀 BẮT ĐẦU TẠO 20 LÔ TRÁI CÂY MIỀN TÂY\n');
  console.log('=' .repeat(60));
  
  for (let i = 0; i < 20; i++) {
    await createBatch(i);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 HOÀN TẤT TẠO 20 LÔ SẢN PHẨM!');
  console.log('\n📊 Tổng kết:');
  console.log('  - 20 lô sản phẩm');
  console.log('  - 140 giao dịch blockchain (20 x 7 bước)');
  console.log('\n✅ Bạn có thể:');
  console.log('  1. Xem danh sách: Tab Quản lý → Tải danh sách');
  console.log('  2. Tạo QR: Tab Người tiêu dùng → Nhập LOT-2025-XXX');
  console.log('  3. Truy xuất: Nhập mã lô để xem lịch sử');
  console.log('\n🌐 Mở: http://localhost:3000\n');
}

// Kiểm tra server
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get({ hostname: API_HOST, port: API_PORT, path: '/api/health' }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

(async () => {
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    console.log('✅ Server đang chạy, bắt đầu tạo dữ liệu...\n');
    await createAllBatches();
  } else {
    console.error('❌ Không kết nối được server!');
    console.error('   Hãy chạy server trước trong terminal khác:');
    console.error('   > &"C:\\Program Files\\nodejs\\node.exe" server.js\n');
  }
})();
