# 🎨 NỀN TẢNG THIẾT KẾ DECAL NHIỆT

Dự án khởi nghiệp xây dựng nền tảng web cho phép người dùng tự thiết kế decal nhiệt để ép lên áo tại nhà.

## 🧩 TÓM TẮT DỰ ÁN

### 🔹 Ý tưởng khởi nghiệp
Xây dựng nền tảng web cho phép người dùng:
- **Tải ảnh cá nhân** lên (ảnh kỷ niệm, ảnh nhóm...)
- **Chỉnh sửa thiết kế** với sticker, text, cọ vẽ, màu sắc
- **Xem preview** trên mockup áo, mũ, túi canvas
- **Đặt hàng** và nhận decal để tự ép tại nhà

### 🎯 Khách hàng mục tiêu
- Sinh viên - học sinh tại Bình Định
- Người trẻ yêu thích phong cách DIY
- Nhóm bạn muốn làm áo nhóm, quà tặng độc đáo

### 💼 Mô hình kinh doanh
**Khách thiết kế** → **Nhóm in decal** → **Giao hàng** → **Khách tự ép**

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
Frontend (Next.js + TypeScript)
├── 🎨 Design Editor (Canvas-based)
├── 📱 Product Gallery & Mockups
├── 🛒 Shopping Cart System
├── 👤 User Dashboard
└── 📦 Order Management

Backend (.NET 8.0 Clean Architecture)
├── 👥 User Management
├── 🎨 Design Storage & Processing
├── 📦 Order Processing
├── 📁 File Management
└── 💳 Payment Integration

Database (SQL Server)
├── Users & Authentication
├── Designs & Canvas Data
├── Orders & Order Items
├── Products & Mockups
└── Assets (Stickers/Fonts)
```

## 🛠️ TECH STACK

### Frontend
- **Next.js 14+** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **Fabric.js/Konva.js** cho canvas editor
- **React Hook Form** cho form management

### Backend
- **.NET 8.0** với Clean Architecture
- **Entity Framework Core** với Code First
- **SQL Server** database
- **Azure Blob Storage** cho file storage
- **SignalR** cho real-time updates

## 📅 ROADMAP PHÁT TRIỂN (12 TUẦN)

### 🏗️ Phase 1: Foundation (Tuần 1-3)
**Tuần 1: Setup & Basic Structure**
- ✅ Setup project structure (FE + BE)
- ✅ Database design cơ bản
- ✅ User authentication system
- ✅ Basic UI layout

**Tuần 2: Core Backend APIs**
- 🔄 User management APIs
- 🔄 File upload system
- 🔄 Design CRUD operations
- 🔄 Basic product catalog

**Tuần 3: Basic Frontend**
- ⏳ User registration/login UI
- ⏳ Dashboard layout
- ⏳ Basic design gallery
- ⏳ Responsive design

### 🎨 Phase 2: Design Editor (Tuần 4-7)
**Tuần 4: Canvas Foundation**
- ⏳ Implement canvas library (Fabric.js/Konva.js)
- ⏳ Basic image upload & display
- ⏳ Canvas controls (zoom, pan)

**Tuần 5: Design Tools**
- ⏳ Text tool với multiple fonts
- ⏳ Sticker library integration
- ⏳ Basic drawing brush
- ⏳ Color picker

**Tuần 6: Advanced Editor**
- ⏳ Layer management
- ⏳ Undo/Redo functionality
- ⏳ Save/Load designs
- ⏳ Export functionality

**Tuần 7: Editor Polish**
- ⏳ UI/UX improvements
- ⏳ Performance optimization
- ⏳ Mobile responsiveness
- ⏳ Bug fixes

### 📱 Phase 3: Product & Preview (Tuần 8-9)
**Tuần 8: Product System**
- ⏳ Product catalog (áo, mũ, túi)
- ⏳ Size management (5-28cm)
- ⏳ Mockup integration

**Tuần 9: Preview System**
- ⏳ Real-time mockup preview
- ⏳ 3D product visualization
- ⏳ Size calculator
- ⏳ Preview export

### 🛒 Phase 4: Shopping & Orders (Tuần 10-11)
**Tuần 10: Shopping Cart**
- ⏳ Add designs to cart
- ⏳ Cart management
- ⏳ Price calculation
- ⏳ Design selection

**Tuần 11: Order System**
- ⏳ Customer info form
- ⏳ Delivery management
- ⏳ Order confirmation
- ⏳ Basic payment integration

### 🚀 Phase 5: Polish & Launch (Tuần 12)
**Tuần 12: Final Polish**
- ⏳ Performance optimization
- ⏳ Security testing
- ⏳ User testing & feedback
- ⏳ Deployment preparation

## 🎨 CHỨC NĂNG CHÍNH

### 📤 Upload & Edit System
- **Upload ảnh**: JPG, PNG, SVG với drag & drop
- **Text Editor**: Multiple fonts, size, color, effects
- **Sticker Library**: Categorized stickers với search
- **Drawing Tools**: Brush với multiple sizes, colors
- **Layer Management**: Reorder, lock/unlock, opacity

### 🖼️ Product Preview
- **Mockup Preview**: Real-time trên áo, mũ, túi canvas
- **Size Options**: 5cm đến 28cm
- **3D Visualization**: Xem trước realistic
- **Export Options**: High-quality preview images

### 🛒 Shopping Experience
- **Design Library**: Save multiple designs per user
- **Shopping Cart**: Add multiple designs
- **Size Calculator**: Auto-calculate price theo size
- **Order Management**: Customer info + delivery tracking

### 💰 Pricing Structure
```
Decal Sizes & Prices:
├── 5-10cm:  15,000 VND
├── 11-15cm: 25,000 VND
├── 16-20cm: 35,000 VND
├── 21-25cm: 45,000 VND
└── 26-28cm: 55,000 VND

Additional Services:
├── Custom design: +20,000 VND
├── Express delivery: +15,000 VND
└── Premium stickers: +5,000 VND
```

## 📊 DATABASE SCHEMA

```sql
-- Core Tables
Users: Id, Email, Password, FullName, Phone, Address, CreatedAt
Designs: Id, UserId, Name, CanvasData, PreviewImage, CreatedAt
Products: Id, Name, Type, MockupImage, BasePrice
Orders: Id, UserId, CustomerInfo, DeliveryAddress, TotalAmount, Status
OrderItems: Id, OrderId, DesignId, ProductId, Size, Quantity, Price

-- Asset Tables
Stickers: Id, Name, ImageUrl, Category, IsPremium
Fonts: Id, Name, FontFile, Category, IsPremium
Mockups: Id, ProductId, ImageUrl, OverlayCoordinates
```

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### Prerequisites
- Node.js 18+ và npm
- .NET 8.0 SDK
- SQL Server hoặc SQL Server LocalDB

### Backend Setup
```bash
cd BE
dotnet restore
dotnet ef database update --project CleanArchitecture.Infrastructure --startup-project CleanArchitecture.WebAPI
dotnet run --project CleanArchitecture.WebAPI
```
API chạy tại: `https://localhost:7000`

### Frontend Setup
```bash
cd FE
npm install
npm run dev
```
Frontend chạy tại: `http://localhost:3000`

## 📈 SUCCESS METRICS

### KPIs cần theo dõi:
- **Daily Active Users**: Số người dùng hoạt động hàng ngày
- **Design Completion Rate**: Tỷ lệ hoàn thành thiết kế
- **Order Conversion Rate**: Tỷ lệ chuyển đổi từ thiết kế sang đơn hàng
- **Customer Retention**: Tỷ lệ khách hàng quay lại
- **Average Order Value**: Giá trị đơn hàng trung bình

## 🎯 LAUNCH STRATEGY

### Soft Launch (Tuần 13-14):
- Beta testing với 20-30 users
- Feedback collection từ sinh viên FPT
- Bug fixes và improvements

### Official Launch (Tuần 15):
- Social media campaign
- Influencer partnerships
- Student community outreach tại Bình Định

## 🔧 NEXT STEPS

### Immediate (Tuần 2-3):
1. Hoàn thiện User Management APIs
2. Implement file upload system
3. Tạo basic design storage
4. Setup frontend authentication

### Short-term (Tuần 4-6):
1. Implement canvas editor với Fabric.js
2. Tạo sticker library
3. Develop text editing tools
4. Mobile responsive design

### Long-term (Tuần 7+):
1. Advanced preview system
2. Payment integration
3. Order management
4. Performance optimization

## 🎯 KẾ HOẠCH CẢI THIỆN DESIGN INTERFACE THEO PRINTIFY

### **📊 PHÂN TÍCH SO SÁNH PRINTIFY VS TRANG HIỆN TẠI**

#### **✅ NHỮNG ĐIỂM GIỐNG:**
- Layout 3 cột: Sidebar | Canvas | Panel
- Front/Back toggle buttons
- Print area với đường viền đứt nét
- Color selection (trắng/đen)
- Product info panel bên phải

#### **❌ NHỮNG ĐIỂM KHÁC BIỆT CHÍNH:**

**1. T-SHIRT MOCKUP:**
- **Printify:** T-shirt realistic, có texture, đổ bóng tự nhiên, perspective 3D
- **Chúng ta:** SVG flat, không có chiều sâu, trông như line art

**2. CANVAS BACKGROUND:**
- **Printify:** Background trắng sạch, T-shirt nổi bật
- **Chúng ta:** Background gradient xám, kém contrast

**3. PRINT AREA:**
- **Printify:** Print area nhỏ gọn, tỷ lệ chuẩn với T-shirt
- **Chúng ta:** Print area quá lớn, không tỷ lệ

**4. SIDEBAR TOOLS:**
- **Printify:** Icons đẹp, layout gọn gàng, tabs rõ ràng
- **Chúng ta:** Text-based, kém visual

**5. PRODUCT PANEL:**
- **Printify:** Thông tin chi tiết, price breakdown, material specs
- **Chúng ta:** Cơ bản hơn, thiếu nhiều thông tin

### **🚀 KẾ HOẠCH CẢI THIỆN CHI TIẾT**

#### **PHASE 1: MOCKUP REALISTIC (Ưu tiên cao) - Tuần 1-2**

**1.1 Tạo T-shirt mockup realistic:**
- ⏳ Thay thế SVG bằng PNG/JPG realistic
- ⏳ Thêm texture fabric cho T-shirt
- ⏳ Đổ bóng và highlight tự nhiên
- ⏳ Perspective 3D nhẹ cho depth
- ⏳ Wrinkles và folds tự nhiên

**1.2 Cải thiện canvas:**
- ⏳ Background trắng sạch thay vì gradient
- ⏳ T-shirt centered và scaled đúng tỷ lệ
- ⏳ Print area tỷ lệ chuẩn với T-shirt thật
- ⏳ Better contrast và visibility

**1.3 Print area optimization:**
- ⏳ Resize print area theo tỷ lệ thật
- ⏳ Better positioning trên T-shirt
- ⏳ Clearer boundaries và guidelines

#### **PHASE 2: UI/UX IMPROVEMENTS - Tuần 3-4**

**2.1 Sidebar tools enhancement:**
- ⏳ Icons thay vì text cho tools
- ⏳ Better visual hierarchy
- ⏳ Hover effects và animations
- ⏳ Collapsible sections
- ⏳ Tool tooltips

**2.2 Product panel improvements:**
- ⏳ Detailed product specifications
- ⏳ Better price breakdown display
- ⏳ Material information
- ⏳ Size guide với measurements
- ⏳ Color swatches improvement

**2.3 Overall UI polish:**
- ⏳ Consistent spacing và typography
- ⏳ Better color scheme
- ⏳ Improved button styles
- ⏳ Loading states
- ⏳ Error handling UI

#### **PHASE 3: ADVANCED FEATURES - Tuần 5-6**

**3.1 Interactive elements:**
- ⏳ Canvas zoom in/out functionality
- ⏳ Pan canvas với mouse/touch
- ⏳ Better drag & drop experience
- ⏳ Layer ordering controls
- ⏳ Undo/redo functionality

**3.2 Mockup enhancements:**
- ⏳ Multiple T-shirt angles (front/back/side)
- ⏳ Realistic fabric colors
- ⏳ Better print area visualization
- ⏳ Shadow effects cho designs
- ⏳ Realistic fabric texture mapping

**3.3 Performance optimization:**
- ⏳ Faster mockup rendering
- ⏳ Optimized image loading
- ⏳ Better canvas performance
- ⏳ Mobile responsiveness
- ⏳ Touch gestures support

### **📋 IMPLEMENTATION CHECKLIST**

#### **Week 1: Mockup Foundation**
- [ ] Tạo realistic T-shirt PNG mockups
- [ ] Implement white canvas background
- [ ] Fix print area proportions
- [ ] Update mockup positioning
- [ ] Test với different screen sizes

#### **Week 2: Mockup Polish**
- [ ] Add fabric texture effects
- [ ] Implement shadow/highlight
- [ ] Create color variants (white/black/gray)
- [ ] Optimize mockup quality
- [ ] Performance testing

#### **Week 3: UI Enhancement**
- [ ] Design icon set cho tools
- [ ] Implement icon-based toolbar
- [ ] Add hover effects
- [ ] Improve color selection UI
- [ ] Better typography

#### **Week 4: Product Panel**
- [ ] Add detailed product specs
- [ ] Implement price calculator
- [ ] Create size guide
- [ ] Material information display
- [ ] Better layout structure

#### **Week 5: Interactions**
- [ ] Canvas zoom/pan controls
- [ ] Drag & drop improvements
- [ ] Layer management UI
- [ ] Undo/redo system
- [ ] Keyboard shortcuts

#### **Week 6: Final Polish**
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] User testing
- [ ] Documentation update

### **🎨 MOCKUP SPECIFICATIONS**

#### **T-shirt Realistic Requirements:**
```
Dimensions: 800x800px minimum
Format: PNG với transparent background
Colors: White, Black, Gray variants
Features:
├── Realistic fabric texture
├── Natural shadows và highlights
├── Subtle wrinkles
├── Proper neckline detail
├── Sleeve definition
└── Print area overlay coordinates
```

#### **Print Area Guidelines:**
```
T-shirt Print Area:
├── Width: 280px (35% của T-shirt width)
├── Height: 350px (44% của T-shirt height)
├── Position: Center chest area
├── Margin từ top: 120px
└── Safe zone: 20px padding
```

### **🔧 TECHNICAL IMPLEMENTATION**

#### **Files cần update:**
```
FE/public/images/
├── tshirt-white-front-realistic.png
├── tshirt-white-back-realistic.png
├── tshirt-black-front-realistic.png
├── tshirt-black-back-realistic.png
├── hoodie-gray-front-realistic.png
└── hoodie-gray-back-realistic.png

FE/src/components/design/
├── TShirtCanvas.tsx (canvas background)
├── TShirtMockup.tsx (mockup rendering)
├── DesignToolbar.tsx (icon implementation)
├── ProductPanel.tsx (enhanced info)
└── PrintArea.tsx (proportions fix)
```

#### **CSS Updates needed:**
```css
/* Canvas improvements */
.design-canvas {
  background: #ffffff; /* White instead of gradient */
  border: 1px solid #e5e7eb;
}

/* Print area proportions */
.print-area {
  width: 280px;
  height: 350px;
  border: 2px dashed #3b82f6;
}

/* Tool icons */
.tool-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
}
```

### **📈 SUCCESS METRICS**

#### **Quality Indicators:**
- **Visual Similarity:** 90%+ match với Printify interface
- **User Experience:** Smooth interactions, no lag
- **Mobile Responsive:** Works trên tất cả devices
- **Performance:** <2s load time cho mockups
- **Accessibility:** WCAG 2.1 AA compliance

#### **User Testing Goals:**
- **Task Completion:** 95% users có thể design T-shirt
- **Time to First Design:** <3 minutes
- **Error Rate:** <5% user errors
- **Satisfaction Score:** 4.5/5 stars
- **Return Rate:** 70% users quay lại

### **🎯 CURRENT STATUS**

#### **✅ COMPLETED:**
- Basic T-shirt SVG mockups created
- Canvas layout structure
- Color selection functionality
- Front/Back switching
- Basic design tools

#### **🔄 IN PROGRESS:**
- Realistic mockup creation
- Canvas background improvements
- Print area proportions

#### **⏳ PENDING:**
- Icon-based toolbar
- Enhanced product panel
- Advanced interactions
- Performance optimization
- Mobile responsiveness

### **🚀 NEXT IMMEDIATE STEPS:**

1. **Tạo realistic T-shirt mockups** (PNG format)
2. **Update canvas background** (white clean)
3. **Fix print area proportions** (theo spec)
4. **Test trên multiple devices**
5. **Gather user feedback** và iterate

**Target Launch:** End of Week 6
**Beta Testing:** Week 5-6
**Production Ready:** Week 7
