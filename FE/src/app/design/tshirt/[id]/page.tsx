'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TShirtDesignStudio from '@/components/tshirt-design/TShirtDesignStudio';
import AuthGuard from '@/components/auth/AuthGuard';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { DEFAULT_TSHIRT_SIZE, DEFAULT_TSHIRT_COLOR } from '@/data/tshirt-options';

export default function TShirtDesignStudioPage() {
  const params = useParams();
  const router = useRouter();
  const tshirtId = parseInt(params.id as string);

  const [tshirt, setTShirt] = useState<TShirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);

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

      const foundTShirt = mockTShirts.find(t => t.id === id);

      if (!foundTShirt) {
        setError('T-shirt not found');
        return;
      }

      setTShirt(foundTShirt);

      // Initialize design session
      const newSession: TShirtDesignSession = {
        id: `session-${Date.now()}`,
        tshirtId: foundTShirt.id,
        selectedColor: DEFAULT_TSHIRT_COLOR,
        selectedSize: DEFAULT_TSHIRT_SIZE,
        designLayers: [],
        currentPrintArea: 'front',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDesignSession(newSession);

    } catch (err) {
      setError('Failed to load T-shirt');
      console.error('Error fetching t-shirt:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelector = () => {
    router.push('/design');
  };

  const handleSaveDesign = async (session: TShirtDesignSession) => {
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
          <div className="text-red-500 text-lg mb-4">❌ {error || 'T-shirt not found'}</div>
          <button
            onClick={handleBackToSelector}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to T-shirt Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <TShirtDesignStudio
        tshirt={tshirt}
        designSession={designSession}
        onSave={handleSaveDesign}
        onBack={handleBackToSelector}
      />
    </AuthGuard>
  );
}
