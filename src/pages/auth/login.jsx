import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Handle authentication logic here
        console.log('Login form submitted');
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl">
                {/* Left side */}
                <div className="w-full p-10 md:w-1/2">
                    <Link to="/" className="inline-block mb-2 text-3xl font-bold transition-colors hover:text-gray-700">Logo</Link>

                    <h2 className="mt-8 text-2xl font-semibold">Login</h2>
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
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
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
                            <Link to="/register" className="font-medium text-red-500 hover:text-red-600">
                                Sign up
                            </Link>
                        </p>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2 text-sm text-gray-400">Or login with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex justify-center w-full gap-4">
                            <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FaFacebook className="w-5 h-5 text-blue-600" />
                            </button>
                            <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FcGoogle className="w-5 h-5" />
                            </button>
                            <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FaApple className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>
                {/* Right side */}
                <div className="items-center justify-center hidden w-1/2 p-8 md:flex">
                    <img
                        src="/images/login-banner_humic_communityfeedbackwall.png"
                        alt="Login illustration"
                        className="w-full max-w-md rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
}
