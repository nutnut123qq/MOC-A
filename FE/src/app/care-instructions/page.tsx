'use client';

import { PatternWebBackground } from '@/components/ui/BackgroundImage';

export default function CareInstructionsPage() {
  return (
    <PatternWebBackground>
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hướng Dẫn Chăm Sóc Sản Phẩm
            </h1>
            <p className="text-lg text-gray-600">
              Cách ủi decal và bảo quản áo/túi có decal
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1: Cách ủi decal */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Cách Ủi Decal Lên Áo/Túi Tại Nhà
                </h2>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuẩn bị</h3>
                    <p className="text-gray-700">Trải phẳng bề mặt vải, lau sạch bụi.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Đặt decal</h3>
                    <p className="text-gray-700">Đặt decal lên vị trí bạn muốn.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ủi/là</h3>
                    <p className="text-gray-700">Bàn ủi/là nhiệt ~150–160°C, ấn nhẹ & đều 10–15 giây.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Hoàn tất</h3>
                    <p className="text-gray-700">Chờ nguội, bóc từ từ lớp kính. Nếu chưa dính kỹ thì ủi/là thêm 5–10 giây.</p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-lg font-semibold text-amber-800">Mẹo nhỏ</h4>
                  </div>
                  <p className="text-amber-700">
                    Ủi/là chậm, ủi/là kĩ các góc của decal, giữ cố định, không kéo dịch decal
                  </p>
                  <p className="text-amber-700 mt-2 font-medium">
                    Chúc bạn thành công và có một chiếc áo/túi thật xinh nhé!!!
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Bảo quản */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Hướng Dẫn Bảo Quản Áo/Túi Có Decal
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tip 1 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Lộn trái khi giặt</h4>
                    <p className="text-gray-600 text-sm">Giúp bề mặt decal không bị trầy xước.</p>
                  </div>
                </div>

                {/* Tip 2 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Giặt nhẹ nhàng</h4>
                    <p className="text-gray-600 text-sm">Ưu tiên giặt tay hoặc máy chế độ nhẹ, nước lạnh/ấm dưới 40°C.</p>
                  </div>
                </div>

                {/* Tip 3 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tránh hoá chất mạnh</h4>
                    <p className="text-gray-600 text-sm">Không dùng thuốc tẩy mạnh vì dễ phai/hỏng hình in.</p>
                  </div>
                </div>

                {/* Tip 4 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Không vắt xoắn mạnh</h4>
                    <p className="text-gray-600 text-sm">Để tránh gãy, bong hình decal.</p>
                  </div>
                </div>

                {/* Tip 5 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phơi chỗ râm mát</h4>
                    <p className="text-gray-600 text-sm">Lộn trái khi phơi, không phơi trực tiếp dưới nắng gắt.</p>
                  </div>
                </div>

                {/* Tip 6 */}
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Ủi mặt trái, nhiệt độ thấp</h4>
                    <p className="text-gray-600 text-sm">Không ủi trực tiếp lên hình in.</p>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-6">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-800">Tips</h4>
                </div>
                <p className="text-blue-700">
                  Nhớ lộn trái khi giặt & không sấy nhiệt cao nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatternWebBackground>
  );
}
