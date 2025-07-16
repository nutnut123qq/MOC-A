'use client';

import Link from 'next/link';
import { PatternWebBackground } from '@/components/ui/BackgroundImage';

export default function DesignPage() {
  return (
    <PatternWebBackground>
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, #991b1b, #E21C34, #7f1d1d)`}}>
                Chọn Sản Phẩm
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent" style={{backgroundImage: `linear-gradient(to right, #E21C34, #dc2626)`}}>
                Để Thiết Kế
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Lựa chọn sản phẩm bạn muốn thiết kế và bắt đầu sáng tạo ngay!
            </p>
          </div>

          {/* Product Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* T-Shirt Design Option */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border-2 border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34)`}}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Thiết Kế Áo Thun</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Tạo thiết kế độc đáo trên áo thun với các công cụ chuyên nghiệp.
                    Thêm text, sticker, hình ảnh và tùy chỉnh theo ý thích.
                  </p>

                  {/* Features */}
                  <div className="space-y-2 text-sm text-gray-600 mb-8">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Thiết kế mặt trước & mặt sau</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Nhiều màu sắc & kích thước</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Preview 3D realistic</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/design/tshirt/1"
                    className="group inline-flex items-center justify-center space-x-2 w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-full hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(to right, #dc2626, #E21C34)`
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Bắt Đầu Thiết Kế</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bag Design Option */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border-2 border-red-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl">
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34)`}}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Thiết Kế Túi Canvas</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Tạo thiết kế độc đáo trên túi canvas với các công cụ chuyên nghiệp.
                    Thêm text, sticker, hình ảnh và tùy chỉnh theo ý thích.
                  </p>

                  {/* Features */}
                  <div className="space-y-2 text-sm text-gray-600 mb-8">
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Thiết kế 2 mặt túi</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Chất liệu canvas bền đẹp</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Preview 3D realistic</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/design/bag/1"
                    className="group inline-flex items-center justify-center space-x-2 w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-full hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(to right, #dc2626, #E21C34)`
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Bắt Đầu Thiết Kế</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </PatternWebBackground>
  );
}
