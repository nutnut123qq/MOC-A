import { useState, useEffect } from 'react';
import { designAPI, Design, CreateDesignRequest, UpdateDesignRequest } from '@/lib/design-api';

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all designs for current user
  const loadDesigns = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging when backend is down
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Backend không khả dụng')), 5000)
      );

      const designsPromise = designAPI.getMyDesigns();
      const userDesigns = await Promise.race([designsPromise, timeoutPromise]);
      setDesigns(userDesigns);
    } catch (err: any) {
      setError(err.message || 'Failed to load designs');
      console.error('Error loading designs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new design
  const createDesign = async (designData: CreateDesignRequest): Promise<Design | null> => {
    try {
      setError(null);
      const newDesign = await designAPI.createDesign(designData);
      setDesigns(prev => [newDesign, ...prev]); // Add to beginning of list
      return newDesign;
    } catch (err: any) {
      setError(err.message || 'Failed to create design');
      console.error('Error creating design:', err);
      return null;
    }
  };

  // Update existing design
  const updateDesign = async (id: number, designData: UpdateDesignRequest): Promise<Design | null> => {
    try {
      setError(null);
      const updatedDesign = await designAPI.updateDesign(id, designData);
      setDesigns(prev => prev.map(design =>
        design.id === id ? updatedDesign : design
      ));
      return updatedDesign;
    } catch (err: any) {
      setError(err.message || 'Failed to update design');
      console.error('Error updating design:', err);
      return null;
    }
  };

  // Delete design
  const deleteDesign = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await designAPI.deleteDesign(id);
      setDesigns(prev => prev.filter(design => design.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete design');
      console.error('Error deleting design:', err);
      return false;
    }
  };

  // Clone design
  const cloneDesign = async (id: number, newName: string): Promise<Design | null> => {
    try {
      setError(null);
      const clonedDesign = await designAPI.cloneDesign(id, newName);
      setDesigns(prev => [clonedDesign, ...prev]); // Add to beginning of list
      return clonedDesign;
    } catch (err: any) {
      setError(err.message || 'Failed to clone design');
      console.error('Error cloning design:', err);
      return null;
    }
  };

  // Get design by ID
  const getDesignById = async (id: number): Promise<Design | null> => {
    try {
      setError(null);
      const design = await designAPI.getDesignById(id);
      return design;
    } catch (err: any) {
      setError(err.message || 'Failed to get design');
      console.error('Error getting design:', err);
      return null;
    }
  };

  // Auto-load designs on mount (with error handling)
  useEffect(() => {
    // Only auto-load if we're in a context where we need designs
    // Don't auto-load on design editor page to prevent hanging
    const currentPath = window.location.pathname;
    if (currentPath.includes('/my-designs') || currentPath === '/') {
      loadDesigns();
    }
  }, []);

  return {
    designs,
    loading,
    error,
    loadDesigns,
    createDesign,
    updateDesign,
    deleteDesign,
    cloneDesign,
    getDesignById,
    clearError: () => setError(null)
  };
}
