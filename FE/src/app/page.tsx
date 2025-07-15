import Link from "next/link";
import { HeroLogo } from "@/components/ui/Logo";
import { PatternWebBackground } from "@/components/ui/BackgroundImage";
import InteractivePricing from "@/components/ui/InteractivePricing";

export default function Home() {
  return (
    <PatternWebBackground>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '2s', backgroundColor: '#E21C34'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{animationDelay: '4s'}}></div>



        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Logo */}
            <div className="mb-8 flex justify-center">
              <HeroLogo />
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-100 to-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200" style={{backgroundColor: 'rgba(226, 28, 52, 0.1)'}}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>YOU DES ME IN</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, #991b1b, #E21C34, #7f1d1d)`}}>
                Chọn ảnh – Thêm chữ
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, #E21C34, #dc2626)`}}>
                Dán sticker – Xem mockup cực xịn
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Tự tay thiết kế decal nhiệt cho áo/túi/mũ siêu cool, đặt in & nhận hàng tận tay.
              <span className="inline-flex items-center space-x-2 text-red-600 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Gu bạn, style bạn – không đụng hàng!</span>
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/design"
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-full hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                style={{
                  background: `linear-gradient(to right, #dc2626, #E21C34)`
                }}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Thiết Kế Ngay</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 px-8 py-4 border-2 font-semibold text-lg rounded-full hover:bg-red-50 transition-all duration-300"
                style={{
                  borderColor: '#E21C34',
                  color: '#E21C34'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Xem Thư Viện</span>
              </Link>
            </div>
          </div>
        </div>
        </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="inline-flex items-center justify-center space-x-3 text-4xl font-bold text-gray-900 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>Tại Sao GenZ Lại Mê Tít Á!?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Công cụ thiết kế siêu dễ thương với tính năng chuyên nghiệp dành riêng cho bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-red-100 hover:border-red-200" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34)`}}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="inline-flex items-center justify-center space-x-2 text-xl font-semibold text-gray-900 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Up ảnh, thêm text, sticker, vẽ tay tùy thích</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Upload ảnh yêu thích và chỉnh sửa với các công cụ siêu dễ sử dụng.
                Thêm text xinh xắn, sticker đáng yêu, vẽ tay trực tiếp!
              </p>
            </div>

            <div className="group rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-red-100 hover:border-red-200" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #b91c1c, #E21C34)`}}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="inline-flex items-center justify-center space-x-2 text-xl font-semibold text-gray-900 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Xem Trước mockup cực Chill</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mockup 3D – thấy ngay sản phẩm thật trước khi in.
                Đảm bảo 100% hài lòng trước khi đặt hàng!
              </p>
            </div>

            <div className="group rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-red-100 hover:border-red-200" style={{backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #ec4899, #E21C34)`}}>
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="inline-flex items-center justify-center space-x-2 text-xl font-semibold text-gray-900 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Nhanh & Xịn</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                In đẹp, ship lẹ, mở gói là có outfit chất.
                Chỉ cần ủi lên áo tại nhà với bàn là là có ngay outfit xinh xắn!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="inline-flex items-center justify-center space-x-3 text-4xl font-bold text-gray-900 mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span>4 Bước Đơn Giản Là Có Đồ Chất</span>
            </h2>
            <p className="inline-flex items-center justify-center space-x-2 text-xl text-gray-600">
              <span>Chỉ 4 bước dễ dàng để có sản phẩm xinh xắn hoàn hảo</span>
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34)`}}>
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 hidden md:block" style={{background: `linear-gradient(to right, rgba(226, 28, 52, 0.3), transparent)`}}></div>
              </div>
              <h4 className="inline-flex items-center justify-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Tự thiết kế</span>
              </h4>
              <p className="text-gray-600 leading-relaxed">Up ảnh, thêm sticker, vẽ, gõ chữ - tha hồ sáng tạo</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #b91c1c, #E21C34)`}}>
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 hidden md:block" style={{background: `linear-gradient(to right, rgba(226, 28, 52, 0.3), transparent)`}}></div>
              </div>
              <h4 className="inline-flex items-center justify-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                </svg>
                <span>Chọn sản phẩm</span>
              </h4>
              <p className="text-gray-600 leading-relaxed">In lẻ decal hoặc mua theo combo decal + áo/túi/mũ</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #ec4899, #E21C34)`}}>
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute top-10 left-full w-full h-0.5 hidden md:block" style={{background: `linear-gradient(to right, rgba(236, 72, 153, 0.3), transparent)`}}></div>
              </div>
              <h4 className="inline-flex items-center justify-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span>Đặt hàng</span>
              </h4>
              <p className="text-gray-600 leading-relaxed">Xem trước, chốt đơn, thanh toán</p>
            </div>

            <div className="text-center group">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #E21C34, #dc2626)`}}>
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <h4 className="inline-flex items-center justify-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Nhận hàng</span>
              </h4>
              <p className="text-gray-600 leading-relaxed">Nhận sản phẩm, tự ủi hoặc diện sản phẩm sẵn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="inline-flex items-center justify-center space-x-3 text-4xl font-bold text-gray-900 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Bảng Giá Decal Siêu Hợp Lý</span>
            </h2>
            <p className="text-xl text-gray-600">
              <span>Tùy chỉnh size decal từ 5cm - 28cm - Giá cả minh bạch, chất lượng đảm bảo</span>
              <svg className="inline w-6 h-6 ml-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </p>
          </div>

          <InteractivePricing />

          {/* Combo Pricing Table */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="inline-flex items-center justify-center space-x-3 text-3xl font-bold text-gray-900 mb-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span>Bảng Giá Combo Siêu Ưu Đãi</span>
              </h3>
              <p className="text-lg text-gray-600">
                Combo áo/túi + decal - Thiết kế không giới hạn với giá cố định
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Combo Áo + Decal */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 border-2 border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Combo Áo + Decal</h4>
                      <p className="text-gray-600 mb-6">Áo thun + decal không giới hạn số lượng</p>
                      <div className="text-4xl font-bold text-red-600 mb-4">149,000₫</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Áo thun chất lượng cao</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Decal không giới hạn</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Thiết kế tự do</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combo Túi + Decal */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 border-2 border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Combo Túi + Decal</h4>
                      <p className="text-gray-600 mb-6">Túi canvas + decal không giới hạn số lượng</p>
                      <div className="text-4xl font-bold text-red-600 mb-4">149,000₫</div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Túi canvas bền đẹp</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Decal không giới hạn</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Thiết kế tự do</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Note */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="inline-flex items-center space-x-2 text-amber-800 font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Combo tiết kiệm hơn khi bạn muốn nhiều decal trên cùng một sản phẩm</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-red-200" style={{backgroundColor: 'rgba(226, 28, 52, 0.1)'}}>
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="inline-flex items-center space-x-2 text-red-800 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Giá đã bao gồm thiết kế và giao hàng tận nơi tại Bình Định</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="rounded-3xl p-12 relative overflow-hidden" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34, #b91c1c)`}}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            {/* Cute decorative elements */}


            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sẵn Sàng Tạo Thiết Kế
                <span className="inline-flex items-center space-x-2 block text-pink-200">
                  <span>Siêu Dễ Thương?</span>
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </span>
              </h2>
              <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                <span>Bắt đầu thiết kế decal xinh xắn của riêng bạn ngay hôm nay! Công cụ siêu dễ sử dụng, kết quả đẹp mê ly!</span>
                <svg className="inline w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/design"
                  className="group px-8 py-4 font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#E21C34'
                  }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Bắt Đầu Ngay</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white hover:text-red-600 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Xem Mẫu Thiết Kế</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </PatternWebBackground>
  );
}
