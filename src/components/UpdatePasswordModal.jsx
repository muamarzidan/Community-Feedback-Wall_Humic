import { useState } from 'react';
import { X } from 'lucide-react';
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { userAPI } from '@/lib/api';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';


export default function UpdatePasswordModal({ isOpen, onClose }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    
    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.password_confirmation) {
            setError('Password baru dan konfirmasi password tidak cocok');
            return;
        };
        if (formData.password.length < 8) {
            setError('Password baru minimal 8 karakter');
            return;
        };

        setLoading(true);

        try {
            const response = await userAPI.updatePassword(formData);
            setSuccess(response.data.message || 'Password berhasil diubah');
            
            setTimeout(() => {
                setFormData({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
                onClose();
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal mengubah password';
            setError(errorMessage);
        } finally {
            setLoading(false);
        };
    };
    const handleClose = () => {
        setFormData({
            current_password: '',
            password: '',
            password_confirmation: ''
        });
        setError('');
        setSuccess('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
            <div 
                className="relative w-full max-w-md p-8 mx-4 bg-white shadow-xl rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute text-gray-400 transition-colors cursor-pointer top-4 right-4 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                {/* Header & Info */}
                <h2 className="mb-6 text-2xl font-semibold text-center">Ubah Password</h2>
                {error && (
                    <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 border border-green-200 rounded-lg">
                        {success}
                    </div>
                )}
                {/* Main Content */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password Saat Ini
                        </label>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            placeholder="Masukkan password saat ini"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
                        >
                            {showCurrentPassword ? (
                                <HiOutlineEye className="w-5 h-5" />
                            ) : (
                                <HiOutlineEyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {/* New Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password Baru
                        </label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Masukkan password baru"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
                        >
                            {showNewPassword ? (
                                <HiOutlineEye className="w-5 h-5" />
                            ) : (
                                <HiOutlineEyeOff className="w-5 h-5" />
                            )}
                        </button>
                        <PasswordStrengthIndicator password={formData.password} />
                    </div>
                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Konfirmasi password baru"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute text-gray-400 right-3 top-9 hover:text-gray-600"
                        >
                            {showConfirmPassword ? (
                                <HiOutlineEye className="w-5 h-5" />
                            ) : (
                                <HiOutlineEyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-white transition-colors rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};