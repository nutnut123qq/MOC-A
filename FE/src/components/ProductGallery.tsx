'use client';

import { useState, useEffect } from 'react';
import { Product, ProductType } from '@/types/product';
import { apiClient } from '@/lib/api';

interface ProductGalleryProps {
  onProductSelect?: (product: Product) => void;
  selectedProductId?: number;
}

export default function ProductGallery({ onProductSelect, selectedProductId }: ProductGalleryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedType === 'all' 
    ? products 
    : products.filter(p => p.type === selectedType);

  const getProductTypeIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.Shirt:
        return '👕';
      case ProductType.Hat:
        return '🧢';
      case ProductType.CanvasBag:
        return '👜';
      default:
        return '📦';
    }
  };

  const getProductTypeName = (type: ProductType) => {
    switch (type) {
      case ProductType.Shirt:
        return 'Áo';
      case ProductType.Hat:
        return 'Mũ';
      case ProductType.CanvasBag:
        return 'Túi Canvas';
      default:
        return 'Sản phẩm';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Chọn Sản Phẩm</h2>
        
        {/* Product Type Filter */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg ${
              selectedType === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedType(ProductType.Shirt)}
            className={`px-4 py-2 rounded-lg ${
              selectedType === ProductType.Shirt
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👕 Áo
          </button>
          <button
            onClick={() => setSelectedType(ProductType.Hat)}
            className={`px-4 py-2 rounded-lg ${
              selectedType === ProductType.Hat
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🧢 Mũ
          </button>
          <button
            onClick={() => setSelectedType(ProductType.CanvasBag)}
            className={`px-4 py-2 rounded-lg ${
              selectedType === ProductType.CanvasBag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👜 Túi Canvas
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect?.(product)}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedProductId === product.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {product.mockupImageUrl ? (
                  <img
                    src={product.mockupImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-6xl">
                    {getProductTypeIcon(product.type)}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {getProductTypeName(product.type)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {product.basePrice.toLocaleString('vi-VN')} VND
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.mockups.length} mockup{product.mockups.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {selectedProductId === product.id && (
                  <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
                    ✓ Đã chọn sản phẩm này
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Info */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Bảng Giá Theo Kích Thước</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className="text-center p-2 bg-white rounded">
            <div className="font-medium">5-10cm</div>
            <div className="text-blue-600">15,000 VND</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <div className="font-medium">11-15cm</div>
            <div className="text-blue-600">25,000 VND</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <div className="font-medium">16-20cm</div>
            <div className="text-blue-600">35,000 VND</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <div className="font-medium">21-25cm</div>
            <div className="text-blue-600">45,000 VND</div>
          </div>
          <div className="text-center p-2 bg-white rounded">
            <div className="font-medium">26-28cm</div>
            <div className="text-blue-600">55,000 VND</div>
          </div>
        </div>
      </div>
    </div>
  );
}
