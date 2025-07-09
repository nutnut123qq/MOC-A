'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TShirt } from '@/types/tshirt';
import { TShirtDesignSession } from '@/types/tshirt-design';
import DesignToolbar from './DesignToolbar';
import TShirtCanvas from './TShirtCanvas';
import TShirtPanel from './TShirtPanel';
import SaveDesignModal from '@/components/design/SaveDesignModal';
import { storageManager } from '@/utils/storageManager';
import { useStorageWarning } from '@/components/debug/StorageDebug';
import { useDesigns } from '@/hooks/useDesigns';
import { CreateDesignRequest } from '@/lib/design-api';

interface TShirtDesignStudioProps {
  tshirt: TShirt;
  designSession: TShirtDesignSession;
  onSave: (session: TShirtDesignSession) => void;
  onBack: () => void;
}

export default function TShirtDesignStudio({
  tshirt,
  designSession,
  onSave,
  onBack
}: TShirtDesignStudioProps) {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<TShirtDesignSession>(designSession);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Design management hook
  const { createDesign, loading: designLoading } = useDesigns();

  // Monitor storage usage
  useStorageWarning();

  const handleSessionUpdate = (updatedSession: TShirtDesignSession) => {
    setCurrentSession({
      ...updatedSession,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    // Show save modal instead of calling onSave directly
    setShowSaveModal(true);
  };

  const handleSaveDesign = async (designData: CreateDesignRequest) => {
    try {
      setSaving(true);

      console.log('💾 Saving design data:', {
        name: designData.name,
        productId: designData.productId,
        layersCount: designData.designSession.designLayers.length,
        layers: designData.designSession.designLayers.map(layer => ({
          id: layer.id,
          type: layer.type,
          contentSize: typeof layer.content === 'string' ? layer.content.length : 'N/A',
          position: layer.position,
          transform: layer.transform
        }))
      });

      const savedDesign = await createDesign(designData);

      if (savedDesign) {
        console.log('✅ Design saved successfully:', savedDesign);
        // Also call the original onSave for backward compatibility
        await onSave(currentSession);
        alert('Thiết kế đã được lưu thành công!');
      } else {
        // If savedDesign is null, createDesign failed but didn't throw
        throw new Error('Failed to save design');
      }
    } catch (error) {
      console.error('❌ Error saving design:', error);
      alert('Không thể lưu thiết kế. Vui lòng thử lại.');
      // Don't redirect or do anything else, just show error
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    // Save current session using storage manager with quota handling
    const success = storageManager.setItem(`design-session-${tshirt.id}`, currentSession);

    if (success) {
      router.push(`/design/tshirt/${tshirt.id}/preview`);
    } else {
      // Show error message if storage failed
      alert('⚠️ Không thể lưu thiết kế do bộ nhớ đầy. Vui lòng xóa các thiết kế cũ hoặc làm mới trang.');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Back button and T-shirt info */}
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
              <h1 className="text-lg font-bold text-gray-900">{tshirt.name}</h1>
              <p className="text-sm text-gray-500">{tshirt.brand}</p>
            </div>
          </div>

          {/* Center: Print area toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleSessionUpdate({
                ...currentSession,
                currentPrintArea: 'front'
              })}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentSession.currentPrintArea === 'front'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => handleSessionUpdate({
                ...currentSession,
                currentPrintArea: 'back'
              })}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentSession.currentPrintArea === 'back'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Back
            </button>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePreview}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Xem Trước
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
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
            tshirt={tshirt}
          />
        </div>

        {/* Center - T-Shirt Canvas */}
        <div className="flex-1 flex flex-col min-w-0">
          <TShirtCanvas
            tshirt={tshirt}
            designSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
          />
        </div>

        {/* Right Panel - T-Shirt Options */}
        <div className="w-80 bg-white border-l border-gray-200">
          <TShirtPanel
            tshirt={tshirt}
            designSession={currentSession}
            onSessionUpdate={handleSessionUpdate}
            onPreview={handlePreview}
          />
        </div>
      </div>

      {/* Save Design Modal */}
      <SaveDesignModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveDesign}
        designSession={currentSession}
        productId={tshirt.id}
        productName={tshirt.name}
        loading={saving || designLoading}
      />
    </div>
  );
}
