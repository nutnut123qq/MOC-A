'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TShirtSelector from '@/components/tshirt-design/TShirtSelector';
import { TShirt } from '@/types/tshirt';
import { apiClient } from '@/lib/api';
import LoadingSpinner, { SkeletonCard } from '@/components/ui/LoadingSpinner';

export default function TShirtDesignPage() {
  const router = useRouter();
  const [tshirts, setTShirts] = useState<TShirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTShirts();
  }, []);

  const fetchTShirts = async () => {
    try {
      setLoading(true);
      // For now, use mock data since we haven't implemented the API yet
      const mockTShirts: TShirt[] = [
        {
          id: 1,
          name: 'Classic Cotton Tee',
          description: 'Comfortable 100% cotton t-shirt perfect for everyday wear',
          style: 'basic_tee' as any,
          brand: 'BasicWear',
          basePrice: 150000,
          variants: [
            {
              id: 'classic-white',
              color: 'white',
              colorName: 'White',
              colorHex: '#FFFFFF',
              sizes: [
                { size: 'S', name: 'Small', available: true },
                { size: 'M', name: 'Medium', available: true },
                { size: 'L', name: 'Large', available: true },
                { size: 'XL', name: 'Extra Large', available: true },
              ],
              mockupUrls: {
                front: '',
                back: '',
              },
              available: true,
            },
            {
              id: 'classic-black',
              color: 'black',
              colorName: 'Black',
              colorHex: '#000000',
              sizes: [
                { size: 'S', name: 'Small', available: true },
                { size: 'M', name: 'Medium', available: true },
                { size: 'L', name: 'Large', available: true },
                { size: 'XL', name: 'Extra Large', available: true },
              ],
              mockupUrls: {
                front: '',
                back: '',
              },
              available: true,
            },
          ],
          printAreas: [
            {
              id: 'front',
              name: 'front',
              displayName: 'Front',
              bounds: { x: 140, y: 180, width: 120, height: 150 },
              maxDimensions: { width: 120, height: 150 },
              guidelines: {
                safeArea: { x: 145, y: 185, width: 110, height: 140 },
                recommendedDPI: 300,
                maxFileSize: 10,
                allowedFormats: ['PNG', 'JPG', 'SVG'],
                colorModes: ['RGB'],
              },
              printMethods: ['dtg' as any, 'vinyl' as any],
            },
            {
              id: 'back',
              name: 'back',
              displayName: 'Back',
              bounds: { x: 140, y: 180, width: 120, height: 150 },
              maxDimensions: { width: 120, height: 150 },
              guidelines: {
                safeArea: { x: 145, y: 185, width: 110, height: 140 },
                recommendedDPI: 300,
                maxFileSize: 10,
                allowedFormats: ['PNG', 'JPG', 'SVG'],
                colorModes: ['RGB'],
              },
              printMethods: ['dtg' as any, 'vinyl' as any],
            },
          ],
          mockupTemplates: [],
          specifications: {
            material: '100% Cotton',
            weight: 180,
            fit: 'regular',
            neckline: 'crew',
            sleeves: 'short',
            care: ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
            features: ['Pre-shrunk', 'Tear-away label'],
          },
          isActive: true,
          createdAt: new Date().toISOString(),
        },

        {
          id: 2,
          name: 'Premium Hoodie',
          description: 'Cozy fleece hoodie with kangaroo pocket',
          style: 'hoodie' as any,
          brand: 'ComfortWear',
          basePrice: 350000,
          variants: [
            {
              id: 'hoodie-gray',
              color: 'gray',
              colorName: 'Heather Gray',
              colorHex: '#808080',
              sizes: [
                { size: 'S', name: 'Small', available: true },
                { size: 'M', name: 'Medium', available: true },
                { size: 'L', name: 'Large', available: true },
                { size: 'XL', name: 'Extra Large', available: true },
              ],
              mockupUrls: {
                front: '/images/hoodie-gray-front.svg',
                back: '/images/hoodie-gray-back.svg',
              },
              available: true,
            },
          ],
          printAreas: [
            {
              id: 'front',
              name: 'front',
              displayName: 'Front',
              bounds: { x: 120, y: 100, width: 180, height: 220 },
              maxDimensions: { width: 180, height: 220 },
              guidelines: {
                safeArea: { x: 130, y: 110, width: 160, height: 200 },
                recommendedDPI: 300,
                maxFileSize: 10,
                allowedFormats: ['PNG', 'JPG', 'SVG'],
                colorModes: ['RGB'],
              },
              printMethods: ['dtg' as any, 'vinyl' as any],
            },
          ],
          mockupTemplates: [],
          specifications: {
            material: '80% Cotton, 20% Polyester',
            weight: 320,
            fit: 'regular',
            neckline: 'crew',
            sleeves: 'long',
            care: ['Machine wash cold', 'Tumble dry low'],
            features: ['Kangaroo pocket', 'Drawstring hood', 'Ribbed cuffs'],
          },
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setTShirts(mockTShirts);
    } catch (err) {
      setError('Failed to fetch t-shirts');
      console.error('Error fetching t-shirts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTShirtSelect = (tshirt: TShirt) => {
    // Navigate to design studio with selected t-shirt
    router.push(`/design/tshirt/${tshirt.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Studio Thiết Kế Áo Thun
              </h1>
              <p className="text-gray-600 mt-1">Chọn T-shirt để bắt đầu thiết kế</p>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Trang chủ</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-blue-600 font-medium">Thiết kế T-shirt</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-8">
            <div className="text-center mb-8">
              <LoadingSpinner size="lg" text="Đang tải T-shirts..." />
            </div>
            {/* Skeleton loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">❌ {error}</div>
            <button
              onClick={fetchTShirts}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <TShirtSelector
            tshirts={tshirts}
            onTShirtSelect={handleTShirtSelect}
          />
        )}
      </div>
    </div>
  );
}
