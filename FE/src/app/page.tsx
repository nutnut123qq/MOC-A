import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>

        {/* Cute decorative elements */}
        <div className="absolute top-32 left-1/4 w-8 h-8 text-amber-300 opacity-60">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="absolute top-48 right-1/4 w-6 h-6 text-orange-300 opacity-60">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-medium rounded-full border border-amber-200">
                ✨ Thiết kế dễ thương cho bạn gái ✨
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent">
                Thiết Kế Decal
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                Dễ Thương & Xinh Xắn
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Tạo ra những thiết kế decal đáng yêu cho áo, mũ, túi canvas với công cụ thiết kế trực tuyến siêu dễ sử dụng.
              <span className="text-amber-600 font-medium"> 💕 Từ ý tưởng đến sản phẩm xinh xắn chỉ trong vài phút!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/design"
                className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg rounded-full hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center space-x-2">
                  <span>🎨 Bắt Đầu Thiết Kế</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 border-2 border-amber-300 text-amber-700 font-semibold text-lg rounded-full hover:border-amber-500 hover:text-amber-800 hover:bg-amber-50 transition-all duration-300"
              >
                ✨ Xem Thư Viện
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💖 Tại Sao Các Bạn Gái Yêu Thích DecalStudio?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Công cụ thiết kế siêu dễ thương với tính năng chuyên nghiệp dành riêng cho bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎨 Upload & Chỉnh Sửa Dễ Dàng</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload ảnh yêu thích và chỉnh sửa với các công cụ siêu dễ sử dụng.
                Thêm text xinh xắn, sticker đáng yêu, vẽ tay trực tiếp!
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">👀 Preview Siêu Chân Thực</h3>
              <p className="text-gray-600 leading-relaxed">
                Xem trước thiết kế của bạn trên áo, mũ, túi canvas với
                mockup 3D siêu đẹp trước khi đặt hàng. Đảm bảo 100% hài lòng!
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🚚 Giao Hàng Tận Tay</h3>
              <p className="text-gray-600 leading-relaxed">
                Decal được in chất lượng cao và giao tận tay bạn.
                Chỉ cần ủi lên áo tại nhà với bàn là là có ngay outfit xinh xắn!
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
              ✨ Cách Thức Hoạt Động Siêu Đơn Giản
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ 4 bước dễ dàng để có sản phẩm xinh xắn hoàn hảo 💕
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-amber-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">🎨 Thiết Kế</h4>
              <p className="text-gray-600 leading-relaxed">Upload ảnh yêu thích và tạo thiết kế với các công cụ siêu dễ sử dụng</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-amber-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">👕 Chọn Sản Phẩm</h4>
              <p className="text-gray-600 leading-relaxed">Chọn áo, mũ hoặc túi canvas xinh xắn để ép decal</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-pink-200 to-transparent hidden md:block"></div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">🛒 Đặt Hàng</h4>
              <p className="text-gray-600 leading-relaxed">Xác nhận đơn hàng và thông tin giao hàng nhanh chóng</p>
            </div>

            <div className="text-center group">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">💝 Nhận Hàng</h4>
              <p className="text-gray-600 leading-relaxed">Nhận decal xinh xắn và tự ép lên áo tại nhà thôi!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              💰 Bảng Giá Decal Siêu Hợp Lý
            </h2>
            <p className="text-xl text-gray-600">
              Giá cả minh bạch, chất lượng đảm bảo - Phù hợp với túi tiền sinh viên 💕
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-3xl p-6 text-center border border-amber-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
              <div className="text-lg font-bold text-amber-600 mb-2">5-10cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15,000₫</div>
              <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">Mini cute</div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center border border-amber-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
              <div className="text-lg font-bold text-amber-600 mb-2">11-15cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">25,000₫</div>
              <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">Vừa xinh</div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-center text-white transform scale-105 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                ✨ YÊU THÍCH NHẤT
              </div>
              <div className="text-lg font-bold mb-2">16-20cm</div>
              <div className="text-3xl font-bold mb-2">35,000₫</div>
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full">Perfect size</div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center border border-amber-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
              <div className="text-lg font-bold text-amber-600 mb-2">21-25cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">45,000₫</div>
              <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">Lớn đẹp</div>
            </div>

            <div className="bg-white rounded-3xl p-6 text-center border border-amber-200 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
              <div className="text-lg font-bold text-amber-600 mb-2">26-28cm</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">55,000₫</div>
              <div className="text-sm text-amber-600 bg-amber-100 px-3 py-1 rounded-full">Siêu to</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-amber-800 font-medium">
                💝 Giá đã bao gồm thiết kế và giao hàng tận nơi tại Bình Định
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-3xl p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            {/* Cute decorative elements */}
            <div className="absolute top-8 left-8 w-6 h-6 text-white/30">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute top-16 right-12 w-4 h-4 text-white/30">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sẵn Sàng Tạo Thiết Kế
                <span className="block text-pink-200">Siêu Dễ Thương? 💕</span>
              </h2>
              <p className="text-xl text-amber-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Bắt đầu thiết kế decal xinh xắn của riêng bạn ngay hôm nay!
                Công cụ siêu dễ sử dụng, kết quả đẹp mê ly! ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/design"
                  className="group px-8 py-4 bg-white text-amber-600 font-semibold text-lg rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🎨 Bắt Đầu Ngay</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/gallery"
                  className="px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white hover:text-amber-600 transition-all duration-300"
                >
                  ✨ Xem Mẫu Thiết Kế
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
