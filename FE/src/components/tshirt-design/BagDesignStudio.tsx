'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import DesignToolbar from './DesignToolbar';
import BagCanvas from './BagCanvas';
import BagPanel from './BagPanel';
import SaveDesignModal from '@/components/design/SaveDesignModal';
import { storageManager } from '@/utils/storageManager';
import { useDesigns } from '@/hooks/useDesigns';
import { CreateDesignRequest } from '@/lib/design-api';

interface BagDesignStudioProps {
  bag: TShirt;
  designSession: TShirtDesignSession;
  onSave: (session: TShirtDesignSession) => void;
  onBack: () => void;
  initialSavedDesignId?: number | null;
}

export default function BagDesignStudio({
  bag,
  designSession,
  onSave,
  onBack,
  initialSavedDesignId
}: BagDesignStudioProps) {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<TShirtDesignSession>(designSession);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedDesignId, setSavedDesignId] = useState<number | null>(initialSavedDesignId || null);

  // Design management hook
  const { createDesign, loading: designLoading } = useDesigns();

  // Sync currentSession with designSession prop when it changes
  useEffect(() => {
    console.log('🔄 BagDesignStudio: designSession prop changed', {
      propSession: designSession,
      currentSession: currentSession,
      layersCount: designSession.designLayers.length
    });

    setCurrentSession(designSession);
  }, [designSession]);

  const handleSessionUpdate = (updatedSession: TShirtDesignSession) => {
    setCurrentSession({
      ...updatedSession,
      updatedAt: new Date().toISOString(),
    });
  };

  // Auto-save to localStorage
  useEffect(() => {
    const sessionKey = `design-session-${bag.id}`;
    storageManager.setItem(sessionKey, currentSession);
  }, [currentSession, bag.id]);

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleSaveDesign = async (designName: string, isPublic: boolean) => {
    try {
      setSaving(true);

      const designRequest: CreateDesignRequest = {
        name: designName,
        productId: bag.id,
        productType: 3, // CanvasBag
        selectedSize: currentSession.selectedSize,
        selectedColor: currentSession.selectedColor,
        designLayers: currentSession.designLayers,
        currentPrintArea: 'front', // Always front for bag
        isPublic: isPublic,
        productMode: currentSession.productMode,
        comboPrice: currentSession.comboPrice,
      };

      console.log('🎨 Creating bag design:', designRequest);

      const savedDesign = await createDesign(designRequest);
      
      if (savedDesign && savedDesign.id) {
        setSavedDesignId(savedDesign.id);
        
        // Update session with saved design ID
        const updatedSession = {
          ...currentSession,
          savedDesignId: savedDesign.id,
        };
        setCurrentSession(updatedSession);
        
        // Call parent onSave
        onSave(updatedSession);
        
        console.log('✅ Bag design saved successfully:', savedDesign);
      }

      setShowSaveModal(false);
    } catch (error) {
      console.error('❌ Error saving bag design:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Save current session before preview
    const sessionKey = `design-session-${bag.id}`;
    const success = storageManager.setItem(sessionKey, currentSession);

    if (success) {
      // Navigate to preview page
      router.push(`/design/bag/${bag.id}/preview`);
    } else {
      // Show error message if storage failed
      alert('⚠️ Không thể lưu thiết kế do bộ nhớ đầy. Vui lòng xóa các thiết kế cũ hoặc làm mới trang.');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden pt-20">
      {/* Header */}
      <div className="fixed top-20 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Back button and bag info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Quay Lại</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{bag.name}</h1>
              <p className="text-sm text-gray-500">Túi Canvas • 35x40cm • Trắng</p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Xem Trước
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Lưu Thiết Kế
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar - Design Tools */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          <DesignToolbar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            designSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
            tshirt={bag}
          />
        </div>

        {/* Center - Bag Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <BagCanvas
            bag={bag}
            designSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
          />
        </div>

        {/* Right Panel - Bag Options */}
        <div className="w-80 bg-white border-l border-gray-200">
          <BagPanel
            bag={bag}
            designSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
            onPreview={handlePreview}
            savedDesignId={savedDesignId}
          />
        </div>
      </div>

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveDesign}
        designSession={currentSession}
        productId={bag.id}
        productName={bag.name}
        loading={saving || designLoading}
      />
    </div>
  );
}
