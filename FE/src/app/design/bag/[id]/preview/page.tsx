'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import MockupRenderer from '@/components/tshirt-design/MockupRenderer';
import { storageManager } from '@/utils/storageManager';

type MockupView = 'front';

export default function BagPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const bagId = parseInt(params.id as string);

  const [bag, setBag] = useState<TShirt | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);
  const [currentView] = useState<MockupView>('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bagId) {
      loadBagAndDesign();
    }
  }, [bagId]);

  const loadBagAndDesign = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock bag data - same as in main page
      const mockBags = [
        {
          id: 1,
          name: 'Túi Canvas Cơ Bản',
          description: 'Túi canvas chất lượng cao, phù hợp cho thiết kế cá nhân',
          style: 'canvas_bag' as any,
          brand: 'CanvasCraft',
          basePrice: 149000,
          variants: [
            {
              id: 'canvas-white',
              color: 'white',
              colorName: 'Trắng',
              colorHex: '#FFFFFF',
              sizes: [
                { size: 'M', name: 'Vừa', available: true },
              ],
              mockupUrls: {
                front: '/mockups/bags/bag_mockup.jpg',
                back: '/mockups/bags/bag_mockup.jpg',
              },
              available: true,
            },
          ],
          printAreas: [
            {
              id: 'front',
              name: 'front' as 'front',
              displayName: 'Túi Canvas',
              bounds: { x: 75, y: 250, width: 200, height: 150 },
              maxDimensions: { width: 200, height: 150 },
              guidelines: {
                safeArea: { x: 85, y: 260, width: 180, height: 130 },
                recommendedDPI: 300,
                maxFileSize: 10,
                allowedFormats: ['PNG', 'JPG', 'SVG'],
                colorModes: ['RGB'],
              },
              printMethods: ['dtg' as any, 'vinyl' as any],
            },
          ],
          mockupTemplates: [
            {
              id: 'front-view',
              name: 'Túi Canvas',
              printArea: 'front' as any,
              color: 'white',
              imageUrl: '/mockups/bags/bag_mockup.jpg',
              overlayCoordinates: {
                topLeft: { x: 120, y: 330 },
                topRight: { x: 380, y: 330 },
                bottomLeft: { x: 120, y: 480 },
                bottomRight: { x: 380, y: 480 },
              },
              perspective: 'flat' as any,
            },
          ],
          specifications: {
            material: '100% Cotton Canvas',
            weight: 280,
            fit: 'regular' as 'regular',
            neckline: 'none' as any,
            sleeves: 'none' as any,
            care: ['Machine wash cold', 'Air dry'],
            features: ['Reinforced handles', 'Inner pocket', 'Durable stitching'],
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const foundBag = mockBags.find(b => b.id === bagId);

      if (!foundBag) {
        setError('Không tìm thấy túi');
        return;
      }

      setBag(foundBag);

      // Load design session from storage
      const sessionKey = `design-session-${bagId}`;
      const savedSession = storageManager.getItem(sessionKey);

      if (savedSession) {
        setDesignSession(savedSession);
      } else {
        setError('Không tìm thấy thiết kế');
      }

    } catch (err) {
      setError('Không thể tải túi và thiết kế');
      console.error('Error loading bag and design:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDesign = () => {
    router.push(`/design/bag/${bagId}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải xem trước...</p>
        </div>
      </div>
    );
  }

  if (error || !bag || !designSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-red-500 text-lg mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error || 'Không tìm thấy thiết kế'}</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleBackToDesign}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Quay lại Thiết kế
            </button>
            <button
              onClick={handleBackToHome}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDesign}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Quay lại Thiết kế</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">
                Xem trước: {bag.name}
              </h1>
            </div>

            {/* Bag Info */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Túi Canvas • 35x40cm • Trắng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center">
            <MockupRenderer
              tshirt={bag}
              designSession={designSession}
              view={currentView}
              className="max-w-md"
            />
          </div>

          {/* Design Info */}
          <div className="mt-8 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Thông tin sản phẩm</h3>
                <p className="text-gray-600">Túi: {bag.name}</p>
                <p className="text-gray-600">Kích thước: 35x40cm</p>
                <p className="text-gray-600">Màu sắc: Trắng</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Thiết kế</h3>
                <p className="text-gray-600">Số lớp: {designSession.designLayers.length}</p>
                <p className="text-gray-600">Vùng in: Túi Canvas</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Chất liệu</h3>
                <p className="text-gray-600">{bag.specifications.material}</p>
                <p className="text-gray-600">Trọng lượng: {bag.specifications.weight}g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
