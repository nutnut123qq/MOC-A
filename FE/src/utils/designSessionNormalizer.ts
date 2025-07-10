import { TShirtDesignSession } from '@/types/tshirt-design';

/**
 * Normalize design session data từ backend để ensure tất cả required fields có giá trị
 */
export function normalizeDesignSession(
  rawSession: any, 
  fallbackTshirtId: number = 1
): TShirtDesignSession {
  const now = new Date().toISOString();
  
  return {
    id: rawSession?.id || `session-${Date.now()}`,
    tshirtId: rawSession?.tshirtId || fallbackTshirtId,
    selectedColor: rawSession?.selectedColor || 'white',
    selectedSize: rawSession?.selectedSize || 'm',
    designLayers: rawSession?.designLayers || [],
    currentPrintArea: rawSession?.currentPrintArea || 'front',
    createdAt: rawSession?.createdAt || now,
    updatedAt: rawSession?.updatedAt || now,
  };
}

/**
 * Validate design session có đầy đủ data để render không
 */
export function validateDesignSession(session: TShirtDesignSession): boolean {
  return !!(
    session.id &&
    session.tshirtId &&
    session.selectedColor &&
    session.selectedSize &&
    session.currentPrintArea &&
    Array.isArray(session.designLayers)
  );
}

/**
 * Debug log design session structure
 */
export function debugDesignSession(session: any, context: string = ''): void {
  console.log(`🔍 Design Session Debug ${context}:`, {
    hasId: !!session?.id,
    hasTshirtId: !!session?.tshirtId,
    hasSelectedColor: !!session?.selectedColor,
    hasSelectedSize: !!session?.selectedSize,
    hasCurrentPrintArea: !!session?.currentPrintArea,
    hasDesignLayers: Array.isArray(session?.designLayers),
    layersCount: session?.designLayers?.length || 0,
    rawSession: session
  });
}
