'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDesigns } from '@/hooks/useDesigns';
import BagDesignStudio from '@/components/tshirt-design/BagDesignStudio';
import AuthPrompt from '@/components/ui/AuthPrompt';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { DEFAULT_TSHIRT_SIZE, DEFAULT_TSHIRT_COLOR, DEFAULT_PRODUCT_MODE, COMBO_PRICE } from '@/data/tshirt-options';
import { ProductMode } from '@/types/product';

export default function BagDesignStudioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { getDesignById } = useDesigns();
  const bagId = parseInt(params.id as string);

  const [bag, setBag] = useState<TShirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (bagId) {
      fetchBag(bagId);
    }
  }, [bagId]);

  const fetchBag = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // Mock bag data - similar to t-shirt structure
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
            fit: 'regular',
            neckline: 'none',
            sleeves: 'none',
            care: ['Machine wash cold', 'Air dry'],
            features: ['Reinforced handles', 'Inner pocket', 'Durable stitching'],
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const foundBag = mockBags.find(b => b.id === id);

      if (!foundBag) {
        setError('Không tìm thấy túi');
        return;
      }

      setBag(foundBag);

      // Check if we need to load an existing design
      const loadDesignId = searchParams.get('loadDesign');

      if (loadDesignId && isAuthenticated) {
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('API timeout')), 5000)
          );

          const designPromise = getDesignById(parseInt(loadDesignId));
          const savedDesign = await Promise.race([designPromise, timeoutPromise]);

          if (savedDesign && typeof savedDesign === 'object') {
            // Convert saved design to design session
            const loadedSession: TShirtDesignSession = {
              id: `loaded-${savedDesign.id}`,
              tshirtId: foundBag.id,
              selectedColor: savedDesign.selectedColor || DEFAULT_TSHIRT_COLOR,
              selectedSize: savedDesign.selectedSize || DEFAULT_TSHIRT_SIZE,
              designLayers: savedDesign.designLayers || [],
              currentPrintArea: savedDesign.currentPrintArea || 'front',
              createdAt: savedDesign.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productMode: savedDesign.productMode || DEFAULT_PRODUCT_MODE,
              comboPrice: savedDesign.productMode === ProductMode.COMBO ? COMBO_PRICE : undefined,
            };

            setDesignSession(loadedSession);
            return;
          }
        } catch (error) {
          console.warn('Failed to load saved design:', error);
          // Continue with new design session
        }
      }

      // Initialize new design session
      const newSession: TShirtDesignSession = {
        id: `session-${Date.now()}`,
        tshirtId: foundBag.id,
        selectedColor: DEFAULT_TSHIRT_COLOR,
        selectedSize: DEFAULT_TSHIRT_SIZE,
        designLayers: [],
        currentPrintArea: 'front',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productMode: DEFAULT_PRODUCT_MODE,
        comboPrice: DEFAULT_PRODUCT_MODE === ProductMode.COMBO ? COMBO_PRICE : undefined,
      };

      setDesignSession(newSession);

    } catch (err) {
      setError('Không thể tải túi');
      console.error('Error fetching bag:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSaveDesign = async (session: TShirtDesignSession) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      // Save design logic here
      console.log('Saving bag design:', session);
    } catch (error) {
      console.error('Error saving bag design:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải túi...</p>
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
            <span>{error || 'Không tìm thấy túi'}</span>
          </div>
          <button
            onClick={handleBackToHome}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <BagDesignStudio
        bag={bag}
        designSession={designSession}
        onSave={handleSaveDesign}
        onBack={handleBackToHome}
        initialSavedDesignId={searchParams.get('loadDesign') ? parseInt(searchParams.get('loadDesign')!) : null}
      />

      <AuthPrompt
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        title="Đăng nhập để lưu thiết kế"
        message="Bạn cần đăng nhập để lưu thiết kế của mình. Đăng nhập ngay để không mất công sức thiết kế!"
        returnUrl={`/design/bag/${params.id}`}
      />
    </>
  );
}
