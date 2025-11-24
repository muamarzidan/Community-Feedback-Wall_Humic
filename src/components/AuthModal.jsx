import { useState } from 'react';
import { X } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { useAuth } from '@/contexts/AuthContext';

import LoginBanner from '@/assets/images/login-banner-agora.png';
import RegisterBanner from '@/assets/images/register-banner-agora.png';


export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        remember_me: false
    });

    
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const result = await login({
                    email: formData.email,
                    password: formData.password,
                    remember_me: formData.remember_me
                });

                if (result.success) {
                    onClose();
                    window.location.reload();
                } else {
                    setError(result.message);
                };
            } else {
                if (formData.password !== formData.password_confirmation) {
                    setError('Password dan konfirmasi password tidak cocok');
                    setLoading(false);
                    return;
                };

                const result = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                });

                if (result.success) {
                    onClose();
                } else {
                    setError(result.message);
                };
            };
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        };
    };
    const switchMode = (newMode) => {
        setMode(newMode);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            remember_me: false
        });
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="relative w-full max-w-md p-8 mx-4 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute text-gray-400 transition-colors cursor-pointer top-4 right-4 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                {mode === 'login' ? (
                    <div className='space-y-4'>
                        <h2 className="text-2xl font-semibold text-center">Login</h2>
                        <img src={LoginBanner} alt="Description" className="object-cover aspect-video rounded-2xl" />
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                    <input 
                                        type="checkbox" 
                                        name="remember_me"
                                        checked={formData.remember_me}
                                        onChange={handleChange}
                                        className="accent-indigo-500" 
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-red-400 hover:text-red-500 !cursor-pointer">
                                    Forgot Password
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-4 text-white transition bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed !cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                            <p className="text-sm text-center text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className="font-medium text-red-500 hover:text-red-600 !cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </p>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="px-2 text-sm text-gray-400">Or login with</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            <div className="flex justify-center w-full gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50 !cursor-pointer"
                                >
                                    <FcGoogle className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <h2 className="pb-2 text-2xl font-semibold text-center">Sign up</h2>
                        <img src={RegisterBanner} alt="RegisterBanner" className="object-cover aspect-video rounded-2xl" />
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <input type="checkbox" className="mt-1 accent-indigo-500" required />
                                <p>
                                    I agree to all the{" "}
                                    <a href="#" className="font-medium text-red-500 hover:text-red-600">
                                        Terms
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="font-medium text-red-500 hover:text-red-600">
                                        Privacy Policies
                                    </a>
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-4 text-white transition bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create account'}
                            </button>
                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className="font-medium text-red-500 !cursor-pointer hover:text-red-600"
                                >
                                    Login
                                </button>
                            </p>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="px-2 text-sm text-gray-400">Or Sign up with</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            <div className="flex justify-center w-full gap-4">
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50 !cursor-pointer"
                                >
                                    <FcGoogle className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};