'use client';

interface StorageItem {
  data: any;
  timestamp: number;
  size: number;
}

class StorageManager {
  private readonly MAX_SIZE = 4 * 1024 * 1024; // 4MB limit (safe for localStorage)
  private readonly PREFIX = 'decal_';

  // Get storage usage
  getStorageUsage(): { used: number; available: number; percentage: number } {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.PREFIX)) {
        const value = localStorage.getItem(key);
        used += (key.length + (value?.length || 0)) * 2; // UTF-16 encoding
      }
    }
    
    const available = this.MAX_SIZE - used;
    const percentage = (used / this.MAX_SIZE) * 100;
    
    return { used, available, percentage };
  }

  // Check if we can store data
  canStore(data: string): boolean {
    const dataSize = data.length * 2; // UTF-16 encoding
    const { available } = this.getStorageUsage();
    return dataSize <= available;
  }

  // Clean old sessions to make space
  cleanOldSessions(keepCount: number = 3): void {
    const sessions: Array<{ key: string; timestamp: number }> = [];
    
    // Find all design sessions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.PREFIX}design-session-`)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            sessions.push({
              key,
              timestamp: new Date(parsed.updatedAt || parsed.createdAt).getTime()
            });
          }
        } catch (e) {
          // Invalid session, remove it
          localStorage.removeItem(key);
        }
      }
    }

    // Sort by timestamp (newest first) and remove old ones
    sessions.sort((a, b) => b.timestamp - a.timestamp);
    const toRemove = sessions.slice(keepCount);
    
    toRemove.forEach(session => {
      localStorage.removeItem(session.key);
      console.log(`🗑️ Removed old session: ${session.key}`);
    });
  }

  // Compress design data
  compressDesignData(designSession: any): any {
    const compressed = { ...designSession };
    
    // Compress design layers
    if (compressed.designLayers) {
      compressed.designLayers = compressed.designLayers.map((layer: any) => {
        const compressedLayer = { ...layer };
        
        // Remove unnecessary properties
        delete compressedLayer.tempId;
        delete compressedLayer.isSelected;
        delete compressedLayer.isDragging;
        
        // Compress image data if present
        if (compressedLayer.type === 'image' && compressedLayer.content) {
          // Keep only essential image data
          compressedLayer.content = {
            src: compressedLayer.content.src,
            width: compressedLayer.content.width,
            height: compressedLayer.content.height
          };
        }
        
        return compressedLayer;
      });
    }
    
    return compressed;
  }

  // Set item with quota management
  setItem(key: string, value: any): boolean {
    const fullKey = `${this.PREFIX}${key}`;
    const stringValue = JSON.stringify(value);
    
    try {
      // Check if we can store directly
      if (this.canStore(stringValue)) {
        localStorage.setItem(fullKey, stringValue);
        return true;
      }
      
      // Try to make space by cleaning old sessions
      console.log('🧹 Storage quota exceeded, cleaning old sessions...');
      this.cleanOldSessions(2); // Keep only 2 most recent sessions
      
      // Try again after cleaning
      if (this.canStore(stringValue)) {
        localStorage.setItem(fullKey, stringValue);
        return true;
      }
      
      // If still can't store, try compression for design sessions
      if (key.startsWith('design-session-')) {
        console.log('🗜️ Compressing design session data...');
        const compressed = this.compressDesignData(value);
        const compressedString = JSON.stringify(compressed);
        
        if (this.canStore(compressedString)) {
          localStorage.setItem(fullKey, compressedString);
          return true;
        }
      }
      
      // Last resort: clean more aggressively
      console.log('🚨 Aggressive cleaning: removing all old sessions...');
      this.cleanOldSessions(1); // Keep only 1 session
      
      // Final attempt
      if (this.canStore(stringValue)) {
        localStorage.setItem(fullKey, stringValue);
        return true;
      }
      
      throw new Error('Storage quota exceeded even after cleaning');
      
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
      
      // Show user-friendly error
      this.showStorageError();
      return false;
    }
  }

  // Get item
  getItem(key: string): any {
    try {
      const fullKey = `${this.PREFIX}${key}`;
      const value = localStorage.getItem(fullKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Failed to read from localStorage:', error);
      return null;
    }
  }

  // Remove item
  removeItem(key: string): void {
    const fullKey = `${this.PREFIX}${key}`;
    localStorage.removeItem(fullKey);
  }

  // Clear all app data
  clearAll(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Show storage error to user
  private showStorageError(): void {
    const { used, percentage } = this.getStorageUsage();
    
    const message = `
      ⚠️ Bộ nhớ trình duyệt đã đầy!
      
      Đã sử dụng: ${(used / 1024 / 1024).toFixed(2)}MB (${percentage.toFixed(1)}%)
      
      Vui lòng:
      • Lưu thiết kế hiện tại
      • Xóa các thiết kế cũ không cần thiết
      • Hoặc làm mới trang để dọn dẹp bộ nhớ
    `;
    
    // You can replace this with a proper toast/modal
    alert(message);
  }

  // Get storage stats for debugging
  getStorageStats(): any {
    const usage = this.getStorageUsage();
    const sessionCount = this.getSessionCount();
    
    return {
      usage,
      sessionCount,
      maxSize: this.MAX_SIZE,
      isNearLimit: usage.percentage > 80
    };
  }

  private getSessionCount(): number {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.PREFIX}design-session-`)) {
        count++;
      }
    }
    return count;
  }
}

export const storageManager = new StorageManager();
