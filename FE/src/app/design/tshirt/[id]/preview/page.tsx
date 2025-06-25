'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import MockupRenderer from '@/components/tshirt-design/MockupRenderer';

type MockupView = 'front' | 'back' | 'folded' | 'hanging';

export default function TShirtPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tshirtId = parseInt(params.id as string);

  const [tshirt, setTShirt] = useState<TShirt | null>(null);
  const [designSession, setDesignSession] = useState<TShirtDesignSession | null>(null);
  const [currentView, setCurrentView] = useState<MockupView>('front');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPreviewData();
  }, [tshirtId]);

  const loadPreviewData = async () => {
    try {
      setLoading(true);

      // Get design session from localStorage or URL params
      const sessionData = localStorage.getItem(`design-session-${tshirtId}`);
      if (!sessionData) {
        setError('No design session found');
        return;
      }

      const session: TShirtDesignSession = JSON.parse(sessionData);
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
    router.push(`/design/tshirt/${tshirtId}`);
  };

  const handleColorChange = async (color: string) => {
    setUpdating(true);
    try {
      const updatedSession = { ...designSession!, selectedColor: color };
      setDesignSession(updatedSession);
      localStorage.setItem(`design-session-${tshirt!.id}`, JSON.stringify(updatedSession));
    } finally {
      setTimeout(() => setUpdating(false), 300); // Small delay for smooth transition
    }
  };

  const handleSizeChange = async (size: string) => {
    setUpdating(true);
    try {
      const updatedSession = { ...designSession!, selectedSize: size };
      setDesignSession(updatedSession);
      localStorage.setItem(`design-session-${tshirt!.id}`, JSON.stringify(updatedSession));
    } finally {
      setTimeout(() => setUpdating(false), 300);
    }
  };

  const handleSaveProduct = async () => {
    try {
      // TODO: Implement save to backend
      console.log('Saving product:', { tshirt, designSession });
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleAddToCart = async () => {
    try {
      // TODO: Implement add to cart
      console.log('Adding to cart:', { tshirt, designSession });
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading preview...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Preview Not Available</h2>
          <p className="text-gray-600 mb-6">
            {error || 'No design session found. Please create a design first before previewing.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBackToEditor}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Design Editor
            </button>
            <button
              onClick={() => window.location.href = '/design'}
              className="w-full px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Choose T-shirt
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = tshirt.variants.find(v => v.color === designSession.selectedColor) || tshirt.variants[0];
  const currentSize = currentVariant.sizes.find(s => s.size === designSession.selectedSize) || currentVariant.sizes[0];

  const calculatePrice = () => {
    const basePrice = tshirt.basePrice;
    const sizePrice = currentSize.price || 0;
    const layerCount = designSession.designLayers.length;
    const designPrice = layerCount * 10000;
    return basePrice + sizePrice + designPrice;
  };

  const mockupViews = [
    { id: 'front', name: 'Front', icon: '👕' },
    { id: 'back', name: 'Back', icon: '🔄' },
    { id: 'folded', name: 'Folded', icon: '📦' },
    { id: 'hanging', name: 'Hanging', icon: '🪝' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Left: Logo and breadcrumb */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-gray-900">DecalDesign</span>
            </div>
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
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToEditor}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium text-sm"
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left: Mockup Preview */}
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 relative">
            {updating && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
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
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Mockup view</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {mockupViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as MockupView)}
                  className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center ${
                    currentView === view.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{view.icon}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockupViews.slice(0, 4).map((view) => (
                <div
                  key={`label-${view.id}`}
                  className={`text-xs text-center py-1 ${
                    currentView === view.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {view.name}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                <span className="mr-1">+</span>
                Show more
              </button>
            </div>
          </div>

          {/* Mockup color mode */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Mockup color mode</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="colorMode" className="mr-2" />
                <span className="text-sm">Realistic (CMYK)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="colorMode" className="mr-2" defaultChecked />
                <span className="text-sm">Bright/colourful (RGB)</span>
              </label>
            </div>
          </div>

          {/* Colors */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {tshirt.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleColorChange(variant.color)}
                  disabled={updating}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    designSession.selectedColor === variant.color
                      ? 'border-gray-800 ring-2 ring-gray-300'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: variant.colorHex }}
                  title={variant.colorName}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentVariant.sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => handleSizeChange(size.size)}
                  disabled={updating}
                  className={`px-3 py-2 text-sm rounded border transition-all ${
                    designSession.selectedSize === size.size
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Product:</span>
                <p className="font-medium text-sm">{tshirt.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Color:</span>
                <p className="font-medium text-sm">{currentVariant.colorName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Size:</span>
                <p className="font-medium text-sm">{designSession.selectedSize}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Design elements:</span>
                <p className="font-medium text-sm">{designSession.designLayers.length}</p>
              </div>
            </div>
          </div>

          {/* Download mockup */}
          <div className="p-6 border-t border-gray-200">
            <button className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download mockup
            </button>
          </div>

          {/* Bottom actions */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {calculatePrice().toLocaleString('vi-VN')} ₫
              </p>
              <p className="text-sm text-gray-500">
                {designSession.designLayers.length} design elements
              </p>
            </div>
            <button
              onClick={handleSaveProduct}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Save product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
