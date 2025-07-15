'use client';

import Link from 'next/link';
import { HeroLogo } from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <HeroLogo />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Nền tảng thiết kế và in ấn decal, áo thun online hàng đầu Việt Nam. 
              Tạo thiết kế độc đáo với công cụ dễ sử dụng, chất lượng cao.
            </p>
            <div className="flex items-center space-x-4">
              <a href="mailto:moc@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
              <span className="text-gray-400">moc@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/design/tshirt/1" className="text-gray-300 hover:text-white transition-colors">
                  Thiết kế áo thun
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-white transition-colors">
                  Đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/care-instructions" className="text-gray-300 hover:text-white transition-colors">
                  Hướng dẫn chăm sóc
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="text-gray-300 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Á! Studio. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms-of-use" className="text-gray-400 hover:text-white text-sm transition-colors">
              Điều khoản sử dụng
            </Link>
            <a href="mailto:moc@gmail.com" className="text-gray-400 hover:text-white text-sm transition-colors">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
