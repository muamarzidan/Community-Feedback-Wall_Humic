import { useState } from 'react';
import { X } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', mode);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setShowPassword(false);
        setShowConfirmPassword(false);
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

                {/* Logo */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Logo</h1>
                </div>

                {mode === 'login' ? (
                    <>
                        <h2 className="text-2xl font-semibold">Login</h2>
                        <p className="mb-6 text-sm text-gray-500">
                            Login to access your travelwise account
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
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
                                        <HiOutlineEye className="w-5 h-5" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                    <input type="checkbox" className="accent-indigo-500" />
                                    Remember me
                                </label>
                                <a href="#" className="text-red-400 hover:text-red-500">
                                    Forgot Password
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 text-white transition bg-indigo-500 rounded-md hover:bg-indigo-600"
                            >
                                Login
                            </button>

                            <p className="text-sm text-center text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className="font-medium text-red-500 cursor-pointer hover:text-red-600"
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
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FaFacebook className="w-5 h-5 text-blue-600" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FcGoogle className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FaApple className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold">Sign up</h2>
                        <p className="mb-6 text-sm text-gray-500">
                            Let's get you all set up so you can access your personal account.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
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
                                        <HiOutlineEye className="w-5 h-5" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
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
                                        <HiOutlineEye className="w-5 h-5" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5" />
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
                                className="w-full py-2 text-white transition bg-indigo-500 rounded-md hover:bg-indigo-600"
                            >
                                Create account
                            </button>

                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className="font-medium text-red-500 cursor-pointer hover:text-red-600"
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
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FaFacebook className="w-5 h-5 text-blue-600" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FcGoogle className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-full gap-2 px-6 py-2 transition border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    <FaApple className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
