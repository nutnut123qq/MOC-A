'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import FormInput from '@/components/ui/FormInput';
import PasswordInput from '@/components/ui/PasswordInput';
import { RegisterRequest } from '@/types/auth';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (formData.phoneNumber && !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const registerData: RegisterRequest = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        acceptTerms: formData.acceptTerms,
      };

      await register(registerData);
      // Redirect to returnUrl if provided, otherwise to home
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    } catch (error: any) {
      setApiError(error.message || 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = field === 'acceptTerms' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký
          </h1>
          <p className="text-gray-600">
            Tạo tài khoản mới để bắt đầu
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="text"
              label="Họ"
              placeholder="Nhập họ"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={errors.firstName}
              leftIcon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              required
            />

            <FormInput
              type="text"
              label="Tên"
              placeholder="Nhập tên"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={errors.lastName}
              leftIcon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              required
            />
          </div>

          <FormInput
            type="email"
            label="Email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            leftIcon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            required
          />

          <FormInput
            type="tel"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại (tùy chọn)"
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
            error={errors.phoneNumber}
            leftIcon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="date"
              label="Ngày sinh"
              value={formData.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                value={formData.gender}
                onChange={handleInputChange('gender')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <PasswordInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            showStrengthIndicator
            helperText="Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
            required
          />

          <PasswordInput
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={errors.confirmPassword}
            required
          />

          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mt-1"
              />
              <span className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-amber-600 hover:text-amber-500 font-medium">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-amber-600 hover:text-amber-500 font-medium">
                  Chính sách bảo mật
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng ký...
              </div>
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              href="/auth/login"
              className="text-amber-600 hover:text-amber-500 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
