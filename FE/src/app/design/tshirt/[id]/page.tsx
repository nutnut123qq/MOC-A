'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDesigns } from '@/hooks/useDesigns';
import TShirtDesignStudio from '@/components/tshirt-design/TShirtDesignStudio';
import AuthPrompt from '@/components/ui/AuthPrompt';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { DEFAULT_TSHIRT_SIZE, DEFAULT_TSHIRT_COLOR, DEFAULT_PRODUCT_MODE, COMBO_PRICE } from '@/data/tshirt-options';
import { ProductMode } from '@/types/product';

export default function TShirtDesignStudioPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { getDesignById } = useDesigns();
  const tshirtId = parseInt(params.id as string);

  const [tshirt, setTShirt] = useState<TShirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    if (tshirtId) {
      fetchTShirt(tshirtId);
    }
  }, [tshirtId]);

  const fetchTShirt = async (id: number) => {
    try {
      setLoading(true);

      // Mock data for now - replace with actual API call
      const mockTShirts: TShirt[] = [
        {
          id: 1,
          name: 'Áo Thun Cotton Cơ Bản',
          description: 'Áo thun cotton 100% thoải mái, hoàn hảo cho việc mặc hàng ngày',
          style: 'basic_tee' as any,
          brand: 'BasicWear',
          basePrice: 150000,
          variants: [
            {
              id: 'classic-white',
              color: 'white',
              colorName: 'Trắng',
              colorHex: '#FFFFFF',
              sizes: [
                { size: 'S', name: 'Nhỏ', available: true },
                { size: 'M', name: 'Vừa', available: true },
                { size: 'L', name: 'Lớn', available: true },
                { size: 'XL', name: 'Rất Lớn', available: true },
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
              colorName: 'Đen',
              colorHex: '#000000',
              sizes: [
                { size: 'S', name: 'Nhỏ', available: true },
                { size: 'M', name: 'Vừa', available: true },
                { size: 'L', name: 'Lớn', available: true },
                { size: 'XL', name: 'Rất Lớn', available: true },
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
              displayName: 'Mặt Trước',
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
              displayName: 'Mặt Sau',
              bounds: { x: 129, y: 135, width: 131, height: 165 },
              maxDimensions: { width: 131, height: 165 },
              guidelines: {
                safeArea: { x: 134, y: 140, width: 121, height: 155 },
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
            care: ['Giặt máy nước lạnh', 'Sấy khô ở nhiệt độ thấp', 'Không tẩy trắng'],
            features: ['Co rút trước', 'Nhãn có thể xé được'],
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

      const foundTShirt = mockTShirts.find(t => t.id === id);

      if (!foundTShirt) {
        setError('Không tìm thấy áo thun');
        return;
      }

      setTShirt(foundTShirt);

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

          if (savedDesign && (savedDesign as any).designSession) {
            // Load the saved design session
            const designSession = (savedDesign as any).designSession;
            const loadedSession: TShirtDesignSession = {
              ...designSession,
              id: `session-${Date.now()}`,
              tshirtId: foundTShirt.id,
              updatedAt: new Date().toISOString(),
              // Đảm bảo có các giá trị mặc định
              currentPrintArea: designSession.currentPrintArea || 'front',
              selectedSize: designSession.selectedSize || DEFAULT_TSHIRT_SIZE,
              selectedColor: designSession.selectedColor || DEFAULT_TSHIRT_COLOR,
              // Backward compatibility cho productMode
              productMode: designSession.productMode || DEFAULT_PRODUCT_MODE,
              comboPrice: designSession.comboPrice || (designSession.productMode === ProductMode.COMBO ? COMBO_PRICE : undefined),
              // Lưu ID của design đang load
              savedDesignId: parseInt(loadDesignId),
            };

            console.log('🔄 Loading saved design:', {
              designId: loadDesignId,
              session: loadedSession,
              layersCount: loadedSession.designLayers.length
            });

            // Delay nhỏ để đảm bảo component được mount hoàn toàn
            setTimeout(() => {
              setDesignSession(loadedSession);
            }, 100);
            return;
          }
        } catch (error) {
          console.error('Error loading design:', error);
          // Continue with new session if loading fails
        }
      }

      // Initialize new design session
      const newSession: TShirtDesignSession = {
        id: `session-${Date.now()}`,
        tshirtId: foundTShirt.id,
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
      setError('Không thể tải áo thun');
      console.error('Error fetching t-shirt:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSaveDesign = async (session: TShirtDesignSession) => {
    // Check if user is authenticated before saving
    if (!isAuthenticated) {
      // Show auth prompt instead of redirecting immediately
      setShowAuthPrompt(true);
      return;
    }

    try {
      // TODO: Implement save to backend
      console.log('Saving design session:', session);
      setDesignSession(session);

      // Show success message
      alert('Thiết kế đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Không thể lưu thiết kế. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải studio thiết kế áo thun...</p>
        </div>
      </div>
    );
  }

  if (error || !tshirt || !designSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-red-500 text-lg mb-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error || 'Không tìm thấy áo thun'}</span>
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
      <TShirtDesignStudio
        tshirt={tshirt}
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
        returnUrl={`/design/tshirt/${params.id}`}
      />
    </>
  );
}
