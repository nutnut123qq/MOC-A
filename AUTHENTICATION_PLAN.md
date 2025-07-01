# 🔐 KẾ HOẠCH TRIỂN KHAI CHỨC NĂNG ĐĂNG NHẬP & ĐĂNG KÝ

## 📋 **TỔNG QUAN DỰ ÁN**

### 🎯 **Mục tiêu:**
- Thêm hệ thống authentication hoàn chỉnh cho platform thiết kế decal
- Bảo mật user data và design sessions
- Phân quyền cơ bản User/Admin

### 🏗️ **Kiến trúc:**
- **Frontend**: Next.js 15 với TypeScript
- **Backend**: .NET 8.0 Clean Architecture
- **Database**: Entity Framework Core (Code First)
- **Authentication**: JWT Token + Refresh Token
- **UI**: Tailwind CSS + Modern Design

---

## 🎨 **1. FRONTEND IMPLEMENTATION**

### 📁 **Cấu trúc thư mục:**
```
FE/src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── profile/
│   │   └── page.tsx
│   └── admin/
│       └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── AuthGuard.tsx
│   │   └── AdminGuard.tsx
│   ├── layout/
│   │   ├── Header.tsx (cập nhật)
│   │   └── UserMenu.tsx (mới)
│   └── ui/
│       ├── FormInput.tsx
│       └── PasswordInput.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── auth.ts
│   └── api-client.ts (cập nhật)
├── types/
│   └── auth.ts
└── utils/
    ├── validation.ts
    └── token-manager.ts
```

### 🔧 **Components chính:**

#### **1. AuthContext.tsx**
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
```

#### **2. LoginForm.tsx**
- Email/Password validation
- Remember me checkbox
- Forgot password link
- Modern UI với animations

#### **3. RegisterForm.tsx**
- Full name, email, password, confirm password
- Terms & conditions checkbox
- Password strength indicator

#### **4. AuthGuard.tsx**
- Protect routes yêu cầu authentication
- Redirect to login nếi chưa đăng nhập
- Loading states

#### **5. AdminGuard.tsx**
- Protect admin-only routes
- Check user role = 1 (Admin)
- Redirect to 403 nếu không phải admin

### 🎨 **UI/UX Design:**
- **Style**: Modern minimalist theo design hiện tại
- **Colors**: Blue gradient theme (#3B82F6 → #8B5CF6)
- **Layout**: Centered forms với background patterns
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions và micro-interactions

---

## 🏗️ **2. BACKEND IMPLEMENTATION**

### 📁 **Cấu trúc Clean Architecture:**
```
BE/
├── CleanArchitecture.Domain/
│   ├── Entities/
│   │   ├── User.cs
│   │   └── RefreshToken.cs
│   ├── Enums/
│   │   ├── UserRole.cs
│   │   └── UserStatus.cs
│   └── Interfaces/
│       ├── IUserRepository.cs
│       └── IAuthService.cs
├── CleanArchitecture.Application/
│   ├── DTOs/
│   │   ├── Auth/
│   │   │   ├── LoginDto.cs
│   │   │   ├── RegisterDto.cs
│   │   │   ├── TokenResponseDto.cs
│   │   │   └── UserProfileDto.cs
│   ├── Services/
│   │   ├── AuthService.cs
│   │   ├── TokenService.cs
│   │   └── UserService.cs
│   └── UseCases/
│       └── Auth/
│           ├── LoginUseCase.cs
│           ├── RegisterUseCase.cs
│           ├── RefreshTokenUseCase.cs
│           └── LogoutUseCase.cs
├── CleanArchitecture.Infrastructure/
│   ├── Data/
│   │   ├── Configurations/
│   │   │   ├── UserConfiguration.cs
│   │   │   └── RefreshTokenConfiguration.cs
│   │   └── Migrations/
│   ├── Repositories/
│   │   └── UserRepository.cs
│   └── Services/
│       └── JwtTokenService.cs
└── CleanArchitecture.WebAPI/
    └── Controllers/
        └── AuthController.cs
```

### 🗄️ **Database Schema:**

#### **Users Table:**
```sql
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATETIME2,
    Gender NVARCHAR(10),
    AvatarUrl NVARCHAR(500),
    Role INT NOT NULL DEFAULT 0, -- 0: User, 1: Admin
    Status INT NOT NULL DEFAULT 1, -- 0: Inactive, 1: Active, 2: Suspended
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2,
    LastLoginAt DATETIME2
);
```

#### **RefreshTokens Table:**
```sql
CREATE TABLE RefreshTokens (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Token NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RevokedAt DATETIME2,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

### 🔐 **Security Features:**
- **Password Hashing**: BCrypt với salt
- **JWT Tokens**: Access token (15 min) + Refresh token (7 days)
- **Rate Limiting**: Login attempts protection
- **Role-based Access**: User (0) và Admin (1)
- **Password Reset**: Secure token-based flow

---

## 🔄 **3. API ENDPOINTS**

### 🔐 **Authentication Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### 👤 **User Management:**
```
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/change-password
POST   /api/users/upload-avatar

### 🔧 **Admin Endpoints:**
```
GET    /api/admin/users
PUT    /api/admin/users/{id}/role
DELETE /api/admin/users/{id}
```

### 📊 **Request/Response Examples:**

#### **Register Request:**
```json
{
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "acceptTerms": true
}
```

#### **Login Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2g...",
    "expiresIn": 900,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "role": 0,
      "avatarUrl": null
    }
  }
}
```

---

## 🎯 **4. TÍCH HỢP VỚI HỆ THỐNG HIỆN TẠI**

### 🔗 **Design Session Management:**
- Liên kết design sessions với user accounts
- Save/Load designs từ database
- Share designs với other users

### 🛡️ **Protected Routes:**
```typescript
// Routes yêu cầu authentication:
/design/tshirt/[id]     // Design studio
/profile                // User profile
/my-designs            // User's saved designs

// Routes yêu cầu Admin role:
/admin                  // Admin dashboard
/admin/users           // User management
```

### 📱 **Header Updates:**
- User avatar/name khi đã login
- Dropdown menu: Profile, My Designs, Logout
- Login/Register buttons khi chưa login

---

## 📅 **5. TIMELINE TRIỂN KHAI**

### **Phase 1: Backend Foundation (2-3 ngày)**
- ✅ Setup Entity models
- ✅ Database migrations
- ✅ JWT service implementation
- ✅ Basic auth endpoints

### **Phase 2: Frontend Core (2-3 ngày)**
- ✅ Auth context & hooks
- ✅ Login/Register forms
- ✅ Token management
- ✅ Route protection

### **Phase 3: UI/UX Polish (1-2 ngày)**
- ✅ Modern form designs
- ✅ Loading states & animations
- ✅ Error handling & validation
- ✅ Responsive design

### **Phase 4: Integration (1-2 ngày)**
- ✅ Connect với design system
- ✅ User profile management
- ✅ Design session persistence
- ✅ Testing & bug fixes

### **Phase 5: Admin Features (1-2 ngày)**
- ✅ Admin dashboard
- ✅ User management panel
- ✅ Role assignment
- ✅ Basic analytics

---

## 🧪 **6. TESTING STRATEGY**

### 🔍 **Test Cases:**
- ✅ Registration flow với validation
- ✅ Login/logout functionality
- ✅ Token refresh mechanism
- ✅ Password reset flow
- ✅ Protected route access
- ✅ Design session persistence

### 🛡️ **Security Testing:**
- ✅ SQL injection protection
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Token expiration handling

---

## 🚀 **7. DEPLOYMENT CONSIDERATIONS**

### 🔐 **Environment Variables:**
```env
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:3001
```

### 📊 **Monitoring:**
- Login success/failure rates
- Token refresh frequency
- User registration trends
- Security incident tracking

---

## ✅ **8. XÁC NHẬN YÊU CẦU**

### 🎯 **Đã xác định:**
- ✅ **Tất cả tính năng FREE** - Không cần premium features
- ✅ **Role đơn giản**: 0 = User, 1 = Admin
- ✅ **Không cần**: Email verification, Social login
- ✅ **Form style**: Dedicated pages (không dùng modal)
- ✅ **UI**: Giữ blue gradient theme hiện tại

### 🚀 **Ready to implement:**
- Authentication cơ bản với JWT
- User/Admin role management
- Password reset flow
- Modern UI theo design hiện tại
- Admin dashboard đơn giản

---

## 🎯 **TÓM TẮT IMPLEMENTATION**

### ✅ **Core Features:**
- **Authentication**: Login/Register/Logout với JWT
- **Authorization**: User (0) và Admin (1) roles
- **Security**: BCrypt password + Rate limiting
- **UI**: Modern forms theo design hiện tại
- **Admin**: User management dashboard

### 📅 **Timeline: 7-10 ngày**
1. **Backend foundation** (2-3 ngày)
2. **Frontend core** (2-3 ngày)
3. **UI polish** (1-2 ngày)
4. **Integration** (1-2 ngày)
5. **Admin features** (1-2 ngày)

**🚀 Sẵn sàng bắt đầu implementation!**
