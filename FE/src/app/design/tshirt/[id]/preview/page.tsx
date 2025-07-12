'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import MockupRenderer from '@/components/tshirt-design/MockupRenderer';
import { storageManager } from '@/utils/storageManager';

type MockupView = 'front' | 'back' | 'folded' | 'hanging';

export default function TShirtPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tshirtId = parseInt(params.id as string);
  const designId = searchParams.get('designId');

  const [tshirt, setTShirt] = useState<TShirt | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);
  const [currentView, setCurrentView] = useState<MockupView>('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreviewData();
  }, [tshirtId]);

  const loadPreviewData = async () => {
    try {
      setLoading(true);

      // Get design session using storage manager
      const session = storageManager.getItem(`design-session-${tshirtId}`);
      if (!session) {
        setError('No design session found');
        return;
      }

      setDesignSession(session);

      // Load T-shirt data (same mock data as before)
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
              bounds: { x: 128, y: 155, width: 138, height: 171 },
              maxDimensions: { width: 138, height: 171 },
              guidelines: {
                safeArea: { x: 133, y: 160, width: 128, height: 161 },
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
              bounds: { x: 128, y: 155, width: 138, height: 171 },
              maxDimensions: { width: 138, height: 171 },
              guidelines: {
                safeArea: { x: 133, y: 160, width: 128, height: 161 },
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

      const foundTShirt = mockTShirts.find(t => t.id === tshirtId);
      if (!foundTShirt) {
        setError('T-shirt not found');
        return;
      }

      setTShirt(foundTShirt);
    } catch (err) {
      setError('Failed to load preview data');
      console.error('Error loading preview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEditor = () => {
    // Ưu tiên designId từ URL, sau đó từ session
    const currentDesignId = designId || designSession?.savedDesignId;

    if (currentDesignId) {
      // Nếu có design ID, quay về edit design đó
      router.push(`/design/tshirt/${tshirtId}?loadDesign=${currentDesignId}`);
    } else {
      // Nếu không có design ID, quay về design session hiện tại
      router.push(`/design/tshirt/${tshirtId}`);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải xem trước...</p>
        </div>
      </div>
    );
  }

  if (error || !tshirt || !designSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không Thể Xem Trước</h2>
          <p className="text-gray-600 mb-6">
            {error || 'No design session found. Please create a design first before previewing.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBackToEditor}
              className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Quay lại Editor
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Quay về Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentSize = currentVariant.sizes.find(s => s.size === designSession.selectedSize) || currentVariant.sizes[0];

  const mockupViews = [
    {
      id: 'front',
      name: 'Front',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2h8l2 2v16l-2 2H8l-2-2V4l2-2z"/>
          <path d="M8 6h8"/>
          <path d="M8 10h8"/>
          <path d="M8 14h8"/>
        </svg>
      )
    },
    {
      id: 'back',
      name: 'Back',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2h8l2 2v16l-2 2H8l-2-2V4l2-2z"/>
          <path d="M12 6v12"/>
          <path d="M8 10l4-4 4 4"/>
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-20 left-0 right-0 z-40 h-16">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Breadcrumb only */}
          <div className="flex items-center text-sm text-gray-500">
            <button
              onClick={handleBackToEditor}
              className="hover:text-gray-700 transition-colors"
            >
              Design
            </button>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Preview</span>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToEditor}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-144px)] mt-16">
        {/* Left: Mockup Preview */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <MockupRenderer
              tshirt={tshirt}
              designSession={designSession}
              view={currentView}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Mockup view selector */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Mockup view</h3>
            <div className="grid grid-cols-2 gap-3">
              {mockupViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as MockupView)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    currentView === view.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="mb-2">{view.icon}</div>
                  <span className="text-sm font-medium">{view.name}</span>
                </button>
              ))}
            </div>
          </div>




        </div>
      </div>


    </div>
  );
}
