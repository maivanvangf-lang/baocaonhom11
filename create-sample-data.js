// Script tạo 20 lô trái cây miền Tây tự động
// Chạy script này sau khi server đã khởi động

const API_BASE = 'http://localhost:3000/api';

// Danh sách 20 loại trái cây miền Tây
const fruits = [
  { name: 'Xoài Cát Hòa Lộc', location: 'Đồng Tháp', area: '2 hecta', farmer: 'HTX Đồng Tháp' },
  { name: 'Sầu Riêng Ri6', location: 'Tiền Giang', area: '3 hecta', farmer: 'Nông trại Mỹ Tho' },
  { name: 'Chôm Chôm', location: 'Bến Tre', area: '1.5 hecta', farmer: 'HTX Bến Tre' },
  { name: 'Bưởi Năm Roi', location: 'Vĩnh Long', area: '2.5 hecta', farmer: 'Vườn Bưởi Năm Roi' },
  { name: 'Nhãn Lồng Hưng Yên', location: 'An Giang', area: '1.8 hecta', farmer: 'HTX An Giang' },
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

async function createBatch(index) {
  const fruit = fruits[index];
  const batchId = `LOT-2025-${String(index + 1).padStart(3, '0')}`;
  
  console.log(`\n🌱 Đang tạo ${batchId}: ${fruit.name}...`);
  
  try {
    // 1. Tạo lô sản phẩm
    const batchRes = await fetch(`${API_BASE}/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batchId,
        product: fruit.name,
        producer: fruit.farmer,
        farmLocation: fruit.location,
        area: fruit.area,
        plantingDate: new Date(2025, 0, index + 1).toISOString().split('T')[0],
        notes: `Trái cây đặc sản miền Tây`
      })
    });
    const batch = await batchRes.json();
    console.log(`  ✅ Tạo lô thành công`);
    
    // 2. Ghi nhận chăm sóc
    await fetch(`${API_BASE}/farming/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: fruit.farmer,
        activity: 'fertilizing',
        fertilizer: 'Phân hữu cơ NPK 16-16-8',
        pesticide: 'Không sử dụng hóa chất',
        notes: 'Canh tác theo tiêu chuẩn VietGAP'
      })
    });
    console.log(`  ✅ Ghi nhận chăm sóc`);
    
    // 3. Thu hoạch
    await fetch(`${API_BASE}/harvest/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actor: `Đội thu hoạch ${fruit.farmer}`,
        harvestDate: new Date(2025, 10, index + 1).toISOString().split('T')[0],
        quantity: `${(index + 1) * 50} kg`,
        quality: index % 3 === 0 ? 'excellent' : 'good',
        notes: 'Thu hoạch đúng độ chín'
      })
    });
    console.log(`  ✅ Ghi nhận thu hoạch`);
    
    // 4. Kiểm định chất lượng
    await fetch(`${API_BASE}/quality/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inspector: 'Trung tâm Kiểm định Chất lượng Nông sản',
        certification: index % 2 === 0 ? 'VietGAP' : 'GlobalGAP',
        testResults: 'Đạt tiêu chuẩn an toàn thực phẩm',
        passed: true,
        notes: 'Không có dư lượng thuốc BVTV'
      })
    });
    console.log(`  ✅ Kiểm định chất lượng`);
    
    // 5. Đóng gói
    await fetch(`${API_BASE}/packaging/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packager: 'Công ty Đóng gói Nông sản Miền Tây',
        packageType: 'box',
        quantity: `${(index + 1) * 2} thùng`,
        packagingDate: new Date(2025, 10, index + 2).toISOString().split('T')[0],
        notes: 'Đóng gói chân không, giữ tươi'
      })
    });
    console.log(`  ✅ Đóng gói`);
    
    // 6. Vận chuyển
    await fetch(`${API_BASE}/transport/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transporter: 'Vận tải Hoàng Long',
        from: fruit.location,
        to: 'TP. Hồ Chí Minh',
        vehicle: 'Xe tải lạnh 5 tấn',
        temperature: '5-8°C',
        departureTime: new Date(2025, 10, index + 3, 6, 0).toISOString(),
        estimatedArrival: new Date(2025, 10, index + 3, 12, 0).toISOString(),
        notes: 'Vận chuyển an toàn'
      })
    });
    console.log(`  ✅ Vận chuyển`);
    
    // 7. Nhập kho
    await fetch(`${API_BASE}/warehouse/${batchId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        warehouse: `Co.opMart ${['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7'][index % 4]}`,
        action: 'import',
        quantity: `${(index + 1) * 2} thùng`,
        condition: 'excellent',
        notes: 'Nhập kho đầy đủ'
      })
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
    // Delay 500ms giữa các request để không quá tải server
    await new Promise(resolve => setTimeout(resolve, 500));
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

// Kiểm tra server trước khi chạy
async function checkServer() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) {
      console.log('✅ Server đang chạy, bắt đầu tạo dữ liệu...\n');
      await createAllBatches();
    }
  } catch (error) {
    console.error('❌ Không kết nối được server!');
    console.error('   Hãy chạy server trước:');
    console.error('   > &"C:\\Program Files\\nodejs\\node.exe" server.js\n');
  }
}

// Chạy script
checkServer();
