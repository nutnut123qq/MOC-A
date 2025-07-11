# Cart Design Preview Feature

## 📋 Tổng quan

Tính năng Cart Design Preview cho phép hiển thị hình ảnh preview thực tế của thiết kế T-shirt trong giỏ hàng, thay vì chỉ hiển thị emoji đơn giản. Người dùng có thể thấy chính xác thiết kế họ đã tạo với tất cả các element (text, hình ảnh, decal) được áp dụng lên áo vector.

## 🎯 Mục tiêu

- ✅ Thay thế emoji áo bằng hình ảnh preview thực tế
- ✅ Hiển thị chính xác thiết kế với tất cả elements
- ✅ Tối ưu performance cho việc render nhiều preview
- ✅ Graceful error handling và fallback
- ✅ Responsive design cho các kích thước khác nhau

## 🏗️ Kiến trúc

### Components

#### 1. `CartDesignPreview`
- **Vị trí**: `FE/src/components/cart/CartDesignPreview.tsx`
- **Mục đích**: Render preview của thiết kế T-shirt trong cart
- **Features**:
  - Hỗ trợ 3 kích thước: small (80x100), medium (120x150), large (160x200)
  - Tự động scale elements theo tỷ lệ
  - Render tất cả layer types: text, image, shape
  - Optimized với React.memo

#### 2. `CartPreviewErrorBoundary`
- **Vị trí**: `FE/src/components/cart/CartPreviewErrorBoundary.tsx`
- **Mục đích**: Handle errors gracefully khi render preview
- **Features**:
  - Fallback về emoji khi có lỗi
  - Error logging
  - HOC wrapper cho dễ sử dụng

### Services

#### 1. `CartDesignService`
- **Vị trí**: `FE/src/services/cartDesignService.ts`
- **Mục đích**: Fetch và cache design session data cho cart items
- **Features**:
  - Batch processing để tối ưu API calls
  - Caching với expiry time (5 phút)
  - Error handling cho từng item riêng biệt
  - Rate limiting protection

#### 2. `DesignPreviewGenerator`
- **Vị trí**: `FE/src/utils/designPreviewGenerator.ts`
- **Mục đích**: Generate preview image từ design session (future use)
- **Features**:
  - HTML5 Canvas rendering
  - Support multiple formats (PNG, JPEG)
  - Thumbnail generation
  - Cross-origin image handling

### Backend Updates

#### 1. `DesignService`
- **File**: `BE/CleanArchitecture.Application/Services/DesignService.cs`
- **Changes**:
  - Thêm `GenerateDesignPreviewAsync()` method
  - Auto-generate preview khi create/update design
  - Lưu preview metadata vào database

## 🔄 Data Flow

```
1. Cart Page Load
   ↓
2. useCartItemsWithDesign Hook
   ↓
3. CartDesignService.getDesignSessionsForCartItems()
   ↓
4. Batch API calls to fetch design sessions
   ↓
5. Cache results locally
   ↓
6. Render CartDesignPreview components
   ↓
7. Error boundary handles any render failures
```

## 🚀 Usage

### Basic Usage trong Cart

```tsx
import { useCartItemsWithDesign } from '@/services/cartDesignService';
import CartDesignPreview from '@/components/cart/CartDesignPreview';

function CartPage() {
  const { cartItems } = useCart();
  const { itemsWithDesign, loading } = useCartItemsWithDesign(cartItems);

  return (
    <div>
      {itemsWithDesign.map(item => (
        <div key={item.id}>
          {item.designSession ? (
            <CartDesignPreview 
              designSession={item.designSession}
              size="small"
            />
          ) : (
            <span>👕</span> // Fallback
          )}
        </div>
      ))}
    </div>
  );
}
```

### Với Error Boundary

```tsx
import { CartPreviewErrorBoundary } from '@/components/cart/CartPreviewErrorBoundary';

<CartPreviewErrorBoundary fallback={<span>👕</span>}>
  <CartDesignPreview designSession={session} size="small" />
</CartPreviewErrorBoundary>
```

## ⚡ Performance Optimizations

### 1. Component Level
- **React.memo**: CartDesignPreview được wrap với memo để tránh re-render không cần thiết
- **Lazy loading**: Design sessions được load background, không block UI

### 2. Service Level
- **Batch processing**: API calls được group thành batches (3 items/batch)
- **Caching**: Design sessions được cache 5 phút
- **Rate limiting**: Delay 100ms giữa các batches

### 3. Error Handling
- **Graceful degradation**: Fallback về emoji khi có lỗi
- **Individual error handling**: Một item lỗi không ảnh hưởng items khác
- **Error boundaries**: Prevent component crashes

## 🐛 Troubleshooting

### Common Issues

1. **Preview không hiển thị**
   - Check console logs cho API errors
   - Verify design session data structure
   - Check network connectivity

2. **Performance chậm**
   - Reduce batch size trong CartDesignService
   - Increase cache duration
   - Check for memory leaks

3. **Images không load**
   - Verify CORS settings
   - Check image URLs validity
   - Ensure proper error handling

### Debug Commands

```bash
# Check cache status
console.log(CartDesignService.designSessionCache);

# Clear cache
CartDesignService.clearDesignSessionCache();

# Monitor API calls
// Enable network tab in DevTools
```

## 🔮 Future Enhancements

1. **Server-side preview generation**: Implement actual image generation trên backend
2. **WebP support**: Optimize image formats
3. **Progressive loading**: Load low-res preview first, then high-res
4. **Offline support**: Cache preview images locally
5. **Real-time updates**: Update preview khi design changes

## 📝 Testing

### Manual Testing Checklist

- [ ] Cart hiển thị preview thay vì emoji
- [ ] Loading states hoạt động đúng
- [ ] Error states fallback về emoji
- [ ] Multiple items render correctly
- [ ] Performance acceptable với 10+ items
- [ ] Responsive trên mobile/desktop

### Automated Testing

```bash
# Run component tests
npm test CartDesignPreview

# Run service tests  
npm test CartDesignService

# Run integration tests
npm test cart-preview-integration
```

## 📚 Related Documentation

- [T-shirt Design System](./TSHIRT_DESIGN.md)
- [Cart System](./CART_SYSTEM.md)
- [API Documentation](./API.md)
- [Performance Guidelines](./PERFORMANCE.md)
