import { TShirtDesignSession } from '@/types/tshirt-design';
import { ProductMode } from '@/types/product';
import { DEFAULT_PRODUCT_MODE, COMBO_PRICE } from '@/data/tshirt-options';

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
    productMode: rawSession?.productMode || DEFAULT_PRODUCT_MODE,
    comboPrice: rawSession?.comboPrice || (rawSession?.productMode === ProductMode.COMBO ? COMBO_PRICE : undefined),
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


