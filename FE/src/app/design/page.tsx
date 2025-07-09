'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DesignRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng trực tiếp đến thiết kế T-shirt ID 1
    router.replace('/design/tshirt/1');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng đến studio thiết kế...</p>
      </div>
    </div>
  );
}
