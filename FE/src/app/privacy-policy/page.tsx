'use client';

import { PatternWebBackground } from '@/components/ui/BackgroundImage';

export default function PrivacyPolicyPage() {
  return (
    <PatternWebBackground>
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-lg text-gray-600">
              Privacy Policy - Á! Studio
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-3">1</span>
                Mục đích thu thập thông tin
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  <strong>"Á! Studio"</strong> thu thập thông tin cá nhân như: họ tên, số điện thoại, email, địa chỉ giao hàng để:
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Xử lý & giao đơn hàng đúng thời gian.
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Hỗ trợ chăm sóc khách hàng, xử lý khiếu nại.
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Gửi ưu đãi, khuyến mãi hoặc thông tin mới (nếu bạn đồng ý).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-3">2</span>
                Phạm vi sử dụng thông tin
              </h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Chỉ sử dụng để phục vụ đơn hàng & chăm sóc khách.
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Không chia sẻ cho bên thứ ba ngoài đối tác vận chuyển, xưởng in (trong trường hợp cần in ấn & giao hàng).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-3">3</span>
                Bảo mật thiết kế cá nhân
              </h2>
              <div className="bg-amber-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Mọi file thiết kế cá nhân (hình ảnh, nội dung) mà khách hàng tự tạo trên website sẽ được cam kết chỉ sử dụng đúng mục đích in ấn cho đơn hàng của chính bạn.
                  </p>
                  <p>
                    <strong>"Á! Studio"</strong> không thương mại hóa, không bán, hay dùng lại thiết kế của bạn cho bất kỳ mục đích nào khác.
                  </p>
                  <p>
                    Chúng tôi chỉ sử dụng hình ảnh/thiết kế cá nhân hoá của khách hàng cho mục đích quảng bá khi đã được sự cho phép bạn.
                  </p>
                  <p>
                    Thiết kế sẽ được lưu trữ trong hệ thống tối đa <strong>30 ngày</strong> để phục vụ hậu mãi, sau đó được xóa hoặc ẩn nếu bạn yêu cầu.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-3">4</span>
                Lưu trữ & bảo mật
              </h2>
              <div className="bg-green-50 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Thông tin cá nhân & file thiết kế được lưu trữ trên hệ thống quản lý đơn hàng bảo mật.
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Chúng tôi cam kết không mua bán, tiết lộ dữ liệu khách hàng.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mr-3">5</span>
                Quyền của khách hàng
              </h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="space-y-4 text-gray-700">
                  <p>
                    Bạn có quyền yêu cầu chỉnh sửa, cập nhật, xoá bỏ thông tin & thiết kế cá nhân bất cứ lúc nào.
                  </p>
                  <p>
                    Mọi thắc mắc về dữ liệu, vui lòng liên hệ: <strong>moc@gmail.com</strong>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PatternWebBackground>
  );
}
