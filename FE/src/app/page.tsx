import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Thiết Kế Decal
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chuyên Nghiệp
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Tạo ra những thiết kế decal độc đáo cho áo, mũ, túi canvas với công cụ thiết kế trực tuyến hiện đại.
              <span className="text-blue-600 font-medium">Từ ý tưởng đến sản phẩm hoàn thiện chỉ trong vài phút.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/design"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center space-x-2">
                  <span>Bắt Đầu Thiết Kế</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold text-lg rounded-2xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                Xem Thư Viện
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn DecalStudio?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Công cụ thiết kế hiện đại với tính năng chuyên nghiệp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload & Chỉnh Sửa</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload ảnh của bạn và chỉnh sửa với các công cụ chuyên nghiệp.
                Thêm text, sticker, vẽ tay trực tiếp trên canvas.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview Mockup</h3>
              <p className="text-gray-600 leading-relaxed">
                Xem trước thiết kế của bạn trên áo, mũ, túi canvas với
                mockup 3D chân thực trước khi đặt hàng.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Giao Hàng Tận Nơi</h3>
              <p className="text-gray-600 leading-relaxed">
                Decal được in chất lượng cao và giao tận tay.
                Bạn chỉ cần ủi lên áo tại nhà với bàn là.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cách Thức Hoạt Động
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ 4 bước đơn giản để có sản phẩm hoàn hảo
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Thiết Kế</h4>
              <p className="text-gray-600 leading-relaxed">Upload ảnh và tạo thiết kế với các công cụ chuyên nghiệp</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Chọn Sản Phẩm</h4>
              <p className="text-gray-600 leading-relaxed">Chọn áo, mũ hoặc túi canvas để ép decal</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Đặt Hàng</h4>
              <p className="text-gray-600 leading-relaxed">Xác nhận đơn hàng và thông tin giao hàng</p>
            </div>

            <div className="text-center group">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Nhận Hàng</h4>
              <p className="text-gray-600 leading-relaxed">Nhận decal và tự ép lên áo tại nhà</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bảng Giá Decal Theo Kích Thước
            </h2>
            <p className="text-xl text-gray-600">
              Giá cả minh bạch, chất lượng đảm bảo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg font-bold text-blue-600 mb-2">5-10cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15,000₫</div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Nhỏ</div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg font-bold text-blue-600 mb-2">11-15cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">25,000₫</div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Vừa</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-center text-white transform scale-105 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                PHỔ BIẾN
              </div>
              <div className="text-lg font-bold mb-2">16-20cm</div>
              <div className="text-3xl font-bold mb-2">35,000₫</div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Tối ưu</div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg font-bold text-blue-600 mb-2">21-25cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">45,000₫</div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Lớn</div>
            </div>

            <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg font-bold text-blue-600 mb-2">26-28cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">55,000₫</div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Rất lớn</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-800 font-medium">
                Giá đã bao gồm thiết kế và giao hàng tận nơi tại Bình Định
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-3xl p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sẵn Sàng Tạo Thiết Kế
                <span className="block text-yellow-300">Độc Đáo?</span>
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Bắt đầu thiết kế decal của riêng bạn ngay hôm nay!
                Công cụ dễ sử dụng, kết quả chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/design"
                  className="group px-8 py-4 bg-white text-blue-600 font-semibold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Bắt Đầu Ngay</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/gallery"
                  className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Xem Mẫu Thiết Kế
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
